package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()
	var items []models.SAVe_Acompanhamentos
	// Fetch a few records that have Responsaveis
	database.DB.Where("length(\"Responsaveis\") > 0").Limit(5).Find(&items)

	for _, item := range items {
		fmt.Printf("ID: %d, Responsaveis: '%s'\n", item.ID, item.Responsaveis)
	}
}
