package main

import (
	"fmt"
	"log"
	"os"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	// Initialize Database
	database.Connect()
	if !database.Connected {
		log.Fatal("Could not connect to database.")
	}

	// Verify Tipo_Form for specific IDs
	ids := []int{445, 451}
	var geral []models.SAVe_Geral
	database.DB.Where("\"ID_Caso\" IN ?", ids).Find(&geral)

	output := "--- SAVe_Geral (Tipo_Form Check) ---\n"
	for _, g := range geral {
		output += fmt.Sprintf("ID: %d, Tipo_Form: '%s', Encerrado: '%s'\n", g.ID_Caso, g.Tipo_Form, g.Encerrado)
	}

	err := os.WriteFile("verify_output_utf8_v3.txt", []byte(output), 0644)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Verification output written to verify_output_utf8_v3.txt")
}
