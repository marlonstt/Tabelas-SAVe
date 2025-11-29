package main

import (
	"fmt"
	"log"
	"time"

	"save-backend/internal/models"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, assuming env vars are set")
	}

	// Hardcoded DSN to match db.go
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Hash password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)

	adminUser := models.SAVe_Usuarios{
		Email:              "admin",
		Password:           string(hashedPassword),
		Usuario:            "Admin",
		Role:               "Admin",
		Cargo:              "Administrador",
		Area:               "TI",
		MustChangePassword: false,
		CreatedAt:          time.Now(),
		UpdatedAt:          time.Now(),
	}

	// Check if exists
	var count int64
	db.Model(&models.SAVe_Usuarios{}).Where("email = ?", "admin").Count(&count)
	if count > 0 {
		fmt.Println("Admin user already exists, updating password...")
		db.Model(&models.SAVe_Usuarios{}).Where("email = ?", "admin").Updates(map[string]interface{}{
			"password": string(hashedPassword),
			"role":     "Admin",
		})
	} else {
		fmt.Println("Creating admin user...")
		if err := db.Create(&adminUser).Error; err != nil {
			log.Fatal("Failed to create admin user:", err)
		}
	}

	fmt.Println("Admin user created/updated successfully.")
}
