package main

import (
	"fmt"
	"log"
	"os"

	"save-backend/internal/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
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

	// Drop table
	if err := db.Migrator().DropTable(&models.SAVe_Vitimizacao{}); err != nil {
		log.Fatal("Failed to drop table:", err)
	}
	fmt.Println("Dropped SAVe_Vitimizacao table")

	// AutoMigrate to recreate with current model
	if err := db.AutoMigrate(&models.SAVe_Vitimizacao{}); err != nil {
		log.Fatal("Failed to migrate table:", err)
	}
	fmt.Println("Recreated SAVe_Vitimizacao table with current schema")
}
