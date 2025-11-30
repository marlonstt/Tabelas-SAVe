package main

import (
	"fmt"
	"log"
	"os"
	"save-backend/internal/database"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to database
	database.Connect()

	// Create SAVe_Vitimizacao table
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS "SAVe_Vitimizacao" (
		"ID_Caso" INTEGER PRIMARY KEY,
		"Depoimento_Repetitivo" BOOLEAN DEFAULT FALSE,
		"Espec_Depoimento" TEXT,
		"Falta_Atendimento" BOOLEAN DEFAULT FALSE,
		"Espec_Falta_Atendimento" TEXT,
		"Demora_Justica" BOOLEAN DEFAULT FALSE,
		"Espec_Demora" TEXT,
		"Discriminacao_Institucional" BOOLEAN DEFAULT FALSE,
		"Espec_Discriminacao" TEXT,
		"Violencia_Institucional" BOOLEAN DEFAULT FALSE,
		"Espec_Violencia_Inst" TEXT,
		"Ameaca_Institucional" BOOLEAN DEFAULT FALSE,
		"Espec_Ameaca_Inst" TEXT,
		"Culpabilizacao" BOOLEAN DEFAULT FALSE,
		"Espec_Culpabilizacao" TEXT,
		"Estigmatizacao" BOOLEAN DEFAULT FALSE,
		"Espec_Estigmatizacao" TEXT,
		"Exploracao_Midiatica" BOOLEAN DEFAULT FALSE,
		"Espec_Midia" TEXT,
		"Isolamento_Social" BOOLEAN DEFAULT FALSE,
		"Espec_Isolamento" TEXT,
		"Perda_Credibilidade" BOOLEAN DEFAULT FALSE,
		"Espec_Perda_Credibilidade" TEXT,
		FOREIGN KEY ("ID_Caso") REFERENCES "SAVe_Geral"("ID_Caso") ON DELETE CASCADE
	);
	`

	if err := database.DB.Exec(createTableSQL).Error; err != nil {
		fmt.Fprintf(os.Stderr, "Error creating table: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("✅ Table SAVe_Vitimizacao created successfully!")
}
