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
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Error loading .env file")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Sao_Paulo",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	// 1. Ensure columns exist
	sqls := []string{
		`ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255) UNIQUE;`,
		`ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "password" VARCHAR(255);`,
		`ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "role" VARCHAR(50) DEFAULT 'User';`,
		`ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "must_change_password" BOOLEAN DEFAULT true;`,
		`ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
		`ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`,
	}

	for _, s := range sqls {
		if err := db.Exec(s).Error; err != nil {
			log.Printf("Error executing alteration '%s': %v\n", s, err)
		}
	}

	// 2. Insert User
	// User data
	email := "msgsilva.estagio@mpmg.mp.br"
	passwordHash := "$2a$10$KaiQxkBMn1LChHxoFAmdlOp874PoS9HEl/QQ4N2yTUldfv3HlzGLK"
	usuario := "Maria Silva"
	cargo := "Administrador"
	role := "Admin"

	// Try to insert, ignoring conflict (or handle upsert if GORM allows easily, or just raw SQL)
	insertSQL := `
	INSERT INTO "SAVe_Usuarios" ("email", "password", "cargo", "usuario", "role", "must_change_password", "created_at", "updated_at")
	VALUES (?, ?, ?, ?, ?, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	ON CONFLICT (email) DO UPDATE SET 
		password = EXCLUDED.password,
		usuario = EXCLUDED.usuario,
		cargo = EXCLUDED.cargo,
		role = EXCLUDED.role,
		updated_at = CURRENT_TIMESTAMP;
	`
	// I used '?' for placeholders, GORM uses '?' ? No, postgres driver for GORM uses '?' and translates it?
	// Wait, GORM raw SQL usually uses '?' as placeholder.

	err = db.Exec(insertSQL, email, passwordHash, cargo, usuario, role).Error
	if err != nil {
		log.Fatal("Error inserting user: ", err)
	}

	fmt.Println("User created/updated successfully!")
}
