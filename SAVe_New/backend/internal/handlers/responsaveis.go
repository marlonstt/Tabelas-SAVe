package handlers

import (
	"net/http"
	"save-backend/internal/database"
	"save-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// GetResponsaveis lists all responsaveis
func GetResponsaveis(c *gin.Context) {
	var responsaveis []models.SAVe_Responsaveis
	if err := database.DB.Find(&responsaveis).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch responsaveis"})
		return
	}
	c.JSON(http.StatusOK, responsaveis)
}

// CreateResponsavel creates a new responsavel
func CreateResponsavel(c *gin.Context) {
	var input models.SAVe_Responsaveis
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create responsavel"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// UpdateResponsavel updates an existing responsavel
func UpdateResponsavel(c *gin.Context) {
	id := c.Param("id")
	var responsavel models.SAVe_Responsaveis

	if err := database.DB.First(&responsavel, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Responsavel not found"})
		return
	}

	var input models.SAVe_Responsaveis
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	responsavel.Nome = input.Nome
	responsavel.Cargo = input.Cargo
	responsavel.Area = input.Area

	if err := database.DB.Save(&responsavel).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update responsavel"})
		return
	}

	c.JSON(http.StatusOK, responsavel)
}

// DeleteResponsavel deletes a responsavel
func DeleteResponsavel(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.SAVe_Responsaveis{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete responsavel"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Responsavel deleted successfully"})
}
