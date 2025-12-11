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

	// Create SAVe_Agressor table
	sql := `
CREATE TABLE IF NOT EXISTS "SAVe_Agressor" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER NOT NULL,
    "Tipo" VARCHAR(255),
    "Nome" VARCHAR(255),
    "Apelido" VARCHAR(255),
    "Idade" INTEGER,
    "Sexo" VARCHAR(50),
    "Raca" VARCHAR(50),
    "Relacao" VARCHAR(255),
    "Ocupacao" VARCHAR(255),
    "Renda" VARCHAR(100),
    "Escolaridade" VARCHAR(100),
    "Endereco" TEXT,
    "Antecedentes" VARCHAR(255),
    "Uso_Drogas" VARCHAR(255),
    "Porte_Arma" VARCHAR(50),
    CONSTRAINT fk_agressor_caso 
        FOREIGN KEY ("ID_Caso") 
        REFERENCES "SAVe_Geral"("ID_Caso") 
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agressor_id_caso ON "SAVe_Agressor"("ID_Caso");
`

	fmt.Println("Creating SAVe_Agressor table...")
	if err := db.Exec(sql).Error; err != nil {
		log.Fatal("Failed to create table:", err)
	}

	fmt.Println("✅ Table SAVe_Agressor created successfully!")
}
