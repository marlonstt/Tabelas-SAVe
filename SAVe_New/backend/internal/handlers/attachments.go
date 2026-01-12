package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"save-backend/internal/database"
	"save-backend/internal/models"

	"github.com/gin-gonic/gin"
)

// GetUploadDir returns the directory where uploads should be stored
func GetUploadDir() string {
	dir := os.Getenv("UPLOAD_DIR")
	if dir == "" {
		dir = "./uploads"
	}
	return dir
}

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

	// Prepare upload directory
	uploadBaseDir := GetUploadDir()
	// Create subfolder for caseID to keep it organized (optional, but good practice)
	// For now, let's keep it simple in one folder or maybe by Year/Month?
	// Let's stick to base dir to minimize complexity with paths, but use unique names.
	if err := os.MkdirAll(uploadBaseDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Generate unique filename: caseID_timestamp_originalName
	timestamp := time.Now().UnixNano()
	safeFilename := filepath.Base(header.Filename) // Basic sanitization
	uniqueName := fmt.Sprintf("%d_%d_%s", caseID, timestamp, safeFilename)
	savePath := filepath.Join(uploadBaseDir, uniqueName)

	// Create file on disk
	out, err := os.Create(savePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create file on disk"})
		return
	}
	defer out.Close()

	// Stream content to disk
	if _, err := io.Copy(out, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	attachment := models.SAVe_Anexos{
		ID_Caso:      caseID,
		Tela:         tela,
		Nome_Arquivo: header.Filename, // Display name
		Tipo_Arquivo: header.Header.Get("Content-Type"),
		Caminho:      uniqueName, // Relative path/filename in upload dir
		Criado_Em:    time.Now(),
	}

	if result := database.DB.Create(&attachment); result.Error != nil {
		// Cleanup file if DB insert fails
		os.Remove(savePath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save attachment metadata"})
		return
	}

	// LOG
	actorID, actorEmail := GetUserFromContext(c)
	LogUserActivity(actorID, actorEmail, "UPLOAD_ATTACHMENT", fmt.Sprintf("Anexou arquivo '%s' no caso ID %d", header.Filename, caseID))

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
	// Select only metadata
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

	// Check if file is on disk (New way)
	if attachment.Caminho != "" {
		filePath := filepath.Join(GetUploadDir(), attachment.Caminho)

		// Check if file exists
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			c.JSON(http.StatusNotFound, gin.H{"error": "File not found on server"})
			return
		}

		c.FileAttachment(filePath, attachment.Nome_Arquivo)
		return
	}

	// Fallback for legacy files (if needed, but user said "nao precisa manter arquivos antigos")
	// However, the code logic to just NOT handle them is better than crashing or sending empty.
	// We can just return not found if Caminho is empty, effectively disabling access to old files via this endpoint.
	// As per instruction "nao precisa manter arquivos antigos", we will just return Not Found if no path.
	c.JSON(http.StatusNotFound, gin.H{"error": "File not found (legacy files not supported)"})
}

// DeleteAttachment removes an attachment
func DeleteAttachment(c *gin.Context) {
	idStr := c.Param("id")
	attID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid attachment ID"})
		return
	}

	// Fetch to log details and get path
	var attachment models.SAVe_Anexos
	if err := database.DB.First(&attachment, attID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Attachment not found"})
		return
	}

	// Delete from disk if it has a path
	if attachment.Caminho != "" {
		filePath := filepath.Join(GetUploadDir(), attachment.Caminho)
		os.Remove(filePath) // Ignore error if file doesn't exist, we still want to delete from DB
	}

	if result := database.DB.Delete(&models.SAVe_Anexos{}, attID); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete attachment"})
		return
	}

	// LOG
	actorID, actorEmail := GetUserFromContext(c)
	LogUserActivity(actorID, actorEmail, "DELETE_ATTACHMENT", fmt.Sprintf("Excluiu anexo '%s' (ID %d)", attachment.Nome_Arquivo, attID))

	c.JSON(http.StatusOK, gin.H{"message": "Attachment deleted"})
}
