package main

import (
	"fmt"
	"log"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	// Initialize Database
	database.Connect()
	if !database.Connected {
		log.Fatal("Could not connect to database.")
	}

	// Verify Encerrado = Sim in SAVe_Geral
	var geral []models.SAVe_Geral
	database.DB.Where("\"Encerrado\" = ?", "Sim").Limit(5).Find(&geral)
	fmt.Println("--- SAVe_Geral (Encerrado = Sim) ---")
	for _, g := range geral {
		fmt.Printf("ID: %d, Encerrado: %s\n", g.ID_Caso, g.Encerrado)
	}
}
