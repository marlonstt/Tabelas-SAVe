package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	fmt.Println("Dropping SAVe_Vinculos and SAVe_Vinculos_Apoio...")

	// Drop tables
	if err := database.DB.Migrator().DropTable(&models.SAVe_Vinculos_Apoio{}); err != nil {
		fmt.Println("Error dropping SAVe_Vinculos_Apoio:", err)
	} else {
		fmt.Println("Dropped SAVe_Vinculos_Apoio")
	}

	if err := database.DB.Migrator().DropTable(&models.SAVe_Vinculos{}); err != nil {
		fmt.Println("Error dropping SAVe_Vinculos:", err)
	} else {
		fmt.Println("Dropped SAVe_Vinculos")
	}
}
