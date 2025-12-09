package handlers

import (
	"io"
	"net/http"
	"strconv"
	"time"

	"save-backend/internal/database"
	"save-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// UploadAttachment handles uploading a file for a specific case and screen
func UploadAttachment(c *gin.Context) {
	idStr := c.Param("id")
	caseID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid case ID"})
		return
	}

	// Parse multipart form
	// 32MB max memory
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	tela := c.PostForm("tela")
	if tela == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tela is required"})
		return
	}

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
		return
	}
	defer file.Close()

	// Read file content
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	attachment := models.SAVe_Anexos{
		ID_Caso:      caseID,
		Tela:         tela,
		Nome_Arquivo: header.Filename,
		Tipo_Arquivo: header.Header.Get("Content-Type"),
		Conteudo:     fileBytes,
		Criado_Em:    time.Now(),
	}

	if result := database.DB.Create(&attachment); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save attachment to database"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "File uploaded successfully", "id": attachment.ID})
}

// ListAttachments retrieves all attachments for a case
func ListAttachments(c *gin.Context) {
	idStr := c.Param("id")
	caseID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid case ID"})
		return
	}

	var attachments []models.SAVe_Anexos
	// Select only metadata, not content to save bandwidth
	if result := database.DB.Select("ID", "ID_Caso", "Tela", "Nome_Arquivo", "Tipo_Arquivo", "Criado_Em").Where("\"ID_Caso\" = ?", caseID).Find(&attachments); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch attachments"})
		return
	}

	c.JSON(http.StatusOK, attachments)
}

// DownloadAttachment serves the file content
func DownloadAttachment(c *gin.Context) {
	idStr := c.Param("id")
	attID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid attachment ID"})
		return
	}

	var attachment models.SAVe_Anexos
	if result := database.DB.First(&attachment, attID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attachment not found"})
		return
	}

	// Set headers for download
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename="+attachment.Nome_Arquivo)
	c.Header("Content-Type", attachment.Tipo_Arquivo)
	c.Header("Content-Length", strconv.Itoa(len(attachment.Conteudo)))

	c.Data(http.StatusOK, attachment.Tipo_Arquivo, attachment.Conteudo)
}

// DeleteAttachment removes an attachment
func DeleteAttachment(c *gin.Context) {
	idStr := c.Param("id")
	attID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid attachment ID"})
		return
	}

	if result := database.DB.Delete(&models.SAVe_Anexos{}, attID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete attachment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Attachment deleted"})
}
