package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Database connection
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("Connected to database successfully!")

	// Add Encaminhamento_Pos_Alta column if it doesn't exist
	sql := `
ALTER TABLE "SAVe_Encerramento" 
ADD COLUMN IF NOT EXISTS "Encaminhamento_Pos_Alta" TEXT;
`

	fmt.Println("Adding Encaminhamento_Pos_Alta column to SAVe_Encerramento...")
	if err := db.Exec(sql).Error; err != nil {
		log.Fatal("Failed to add column:", err)
	}

	fmt.Println("✅ Column added successfully!")
}
