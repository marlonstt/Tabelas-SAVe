package main

import (
	"log"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	// Try to migrate missing tables
	err := database.DB.AutoMigrate(
		&models.SAVe_Saude{},
	)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	log.Println("Migration successful")
}
