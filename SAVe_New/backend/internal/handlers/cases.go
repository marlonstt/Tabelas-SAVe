package handlers

import (
	"net/http"
	"strconv"

	"save-backend/internal/database"
	"save-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetAllCases(c *gin.Context) {
	var cases []models.SAVe_Geral
	if err := database.DB.Order("ID_Caso desc").Find(&cases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching cases"})
		return
	}
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
	// Logic to create a new case
	// 1. Get max ID
	var maxID int
	database.DB.Model(&models.SAVe_Geral{}).Select("max(ID_Caso)").Scan(&maxID)
	newID := maxID + 1

	newCase := models.SAVe_Geral{
		ID_Caso:   newID,
		Encerrado: "Não",
		// Set date, etc.
	}

	if err := database.DB.Create(&newCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create case"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": newID, "message": "Case created"})
}
