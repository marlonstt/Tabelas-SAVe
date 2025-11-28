package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"save-backend/internal/database"
	"save-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetAllCases(c *gin.Context) {
	var cases []models.SAVe_Geral
	if err := database.DB.Order("ID_Caso desc").Find(&cases).Error; err != nil {
		fmt.Println("Error fetching cases:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching cases"})
		return
	}
	fmt.Printf("GetAllCases: Found %d cases\n", len(cases))
	c.JSON(http.StatusOK, cases)
}

func GetCaseById(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var geral models.SAVe_Geral
	if err := database.DB.First(&geral, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Case not found"})
		return
	}

	var dadosEntrada models.SAVe_DadosDeEntrada
	database.DB.First(&dadosEntrada, id)

	var identificacao models.SAVe_Identificacao
	database.DB.First(&identificacao, id)

	var telefones []models.SAVe_Identificacao_telefone
	database.DB.Where("ID_Caso = ?", id).Find(&telefones)

	var emails []models.SAVe_Identificacao_email
	database.DB.Where("ID_Caso = ?", id).Find(&emails)

	var enderecos []models.SAVe_Identificacao_endereco
	database.DB.Where("ID_Caso = ?", id).Find(&enderecos)

	// Add other tables here...

	c.JSON(http.StatusOK, gin.H{
		"geral":         geral,
		"dadosEntrada":  dadosEntrada,
		"identificacao": identificacao,
		"telefones":     telefones,
		"emails":        emails,
		"enderecos":     enderecos,
	})
}

func CreateCase(c *gin.Context) {
	// Start transaction
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Lock the table to ensure sequential IDs (strict Max+1)
	// This prevents race conditions where two requests get the same Max ID
	if err := tx.Exec("LOCK TABLE \"SAVe_Geral\" IN EXCLUSIVE MODE").Error; err != nil {
		tx.Rollback()
		fmt.Println("Error locking table:", err) // Log error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to lock table: " + err.Error()})
		return
	}

	// 1. Get max ID safely under lock
	var maxID *int
	if err := tx.Model(&models.SAVe_Geral{}).Select("max(\"ID_Caso\")").Scan(&maxID).Error; err != nil {
		tx.Rollback()
		fmt.Println("Error getting max ID:", err) // Log error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get max ID: " + err.Error()})
		return
	}

	currentMax := 0
	if maxID != nil {
		currentMax = *maxID
	}
	newID := currentMax + 1

	newCase := models.SAVe_Geral{
		ID_Caso:   newID,
		Encerrado: "Não",
		// Initialize other fields if necessary
	}

	if err := tx.Create(&newCase).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create case"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": newID, "message": "Case created"})
}

func DeleteCase(c *gin.Context) {
	// Check for Admin role
	role, exists := c.Get("userRole")
	if !exists || (role != "Admin" && role != "admin") {
		c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Start transaction
	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Delete from dependent tables first (Cascading Delete Manual)
	// 1. Identificacao related tables (1:N)
	if err := tx.Where("ID_Caso = ?", id).Delete(&models.SAVe_Identificacao_telefone{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete phones"})
		return
	}
	if err := tx.Where("ID_Caso = ?", id).Delete(&models.SAVe_Identificacao_email{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete emails"})
		return
	}
	if err := tx.Where("ID_Caso = ?", id).Delete(&models.SAVe_Identificacao_endereco{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete addresses"})
		return
	}

	// 2. Identificacao (1:1)
	if err := tx.Where("ID_Caso = ?", id).Delete(&models.SAVe_Identificacao{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete identificacao"})
		return
	}

	// 3. DadosDeEntrada (1:1)
	if err := tx.Where("ID_Caso = ?", id).Delete(&models.SAVe_DadosDeEntrada{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete dados de entrada"})
		return
	}

	// 4. Main Table (SAVe_Geral)
	if err := tx.Where("ID_Caso = ?", id).Delete(&models.SAVe_Geral{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete case"})
		return
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Case deleted successfully"})
}

func ArchiveCase(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var encerramento models.SAVe_Encerramento
	if err := c.ShouldBindJSON(&encerramento); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	encerramento.ID_Caso = id

	tx := database.DB.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// 1. Update SAVe_Geral Encerrado = "Sim"
	if err := tx.Model(&models.SAVe_Geral{}).Where("ID_Caso = ?", id).Update("Encerrado", "Sim").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update case status"})
		return
	}

	// 2. Save Encerramento data (Create or Update)
	var count int64
	tx.Model(&models.SAVe_Encerramento{}).Where("ID_Caso = ?", id).Count(&count)
	if count > 0 {
		if err := tx.Model(&models.SAVe_Encerramento{}).Where("ID_Caso = ?", id).Updates(&encerramento).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update encerramento data"})
			return
		}
	} else {
		if err := tx.Create(&encerramento).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create encerramento data"})
			return
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Case archived successfully"})
}
