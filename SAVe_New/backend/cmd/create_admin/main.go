package main

import (
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SAVe_Usuarios struct {
	ID                 int    `gorm:"primaryKey;autoIncrement;column:id"`
	Cargo              string `gorm:"column:cargo"`
	Usuario            string `gorm:"column:usuario"`
	Area               string `gorm:"column:area"`
	Email              string `gorm:"unique;column:email"`
	Password           string `gorm:"column:password"`
	Role               string `gorm:"default:User;column:role"`
	MustChangePassword bool   `gorm:"default:true;column:must_change_password"`
	ProfileImage       string `gorm:"column:profile_image"`
}

func (SAVe_Usuarios) TableName() string {
	return "\"SAVe_Usuarios\""
}

func main() {
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Drop existing table
	db.Exec("DROP TABLE IF EXISTS \"SAVe_Usuarios\"")
	fmt.Println("✓ Dropped existing SAVe_Usuarios table")

	// Create table with correct structure
	db.Exec(`
		CREATE TABLE "SAVe_Usuarios" (
			"id" SERIAL PRIMARY KEY,
			"cargo" TEXT,
			"usuario" TEXT,
			"area" TEXT,
			"email" TEXT UNIQUE,
			"password" TEXT,
			"role" TEXT DEFAULT 'User',
			"must_change_password" BOOLEAN DEFAULT true,
			"profile_image" TEXT,
			"created_at" TIMESTAMP DEFAULT NOW(),
			"updated_at" TIMESTAMP DEFAULT NOW()
		)
	`)
	fmt.Println("✓ Created SAVe_Usuarios table")

	// Create new admin user with properly hashed password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("86076448"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}

	result := db.Exec(`
		INSERT INTO "SAVe_Usuarios" ("email", "password", "role", "usuario", "cargo", "area", "must_change_password")
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, "admin@mpmg.mp.br", string(hashedPassword), "Admin", "Admin", "Administrador", "TI", true)

	if result.Error != nil {
		log.Fatal("Failed to create user:", result.Error)
	}

	fmt.Printf("\n✓ User admin@mpmg.mp.br created successfully!\n")
	fmt.Printf("  Email: admin@mpmg.mp.br\n")
	fmt.Printf("  Password: 86076448\n")
	fmt.Printf("  Role: Admin\n")
}
