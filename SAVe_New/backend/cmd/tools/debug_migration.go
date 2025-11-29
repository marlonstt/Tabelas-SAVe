package main

import (
	"log"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	log.Println("Running migration for Protecao Seguranca tables...")

	err := database.DB.AutoMigrate(
		&models.SAVe_protecao_seguranca{},
		&models.SAVe_protecao_seguranca_ameacadores{},
		&models.SAVe_protecao_seguranca_adolescente{},
	)

	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("Migration completed successfully")
}
