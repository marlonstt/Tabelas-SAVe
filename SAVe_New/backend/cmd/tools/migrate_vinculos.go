package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	fmt.Println("Migrating SAVe_Vinculos...")
	err := database.DB.AutoMigrate(&models.SAVe_Vinculos{})
	if err != nil {
		fmt.Println("Failed to migrate SAVe_Vinculos:", err)
	} else {
		fmt.Println("Migration complete for SAVe_Vinculos")
	}

	fmt.Println("Migrating SAVe_Vinculos_Apoio...")
	err = database.DB.AutoMigrate(&models.SAVe_Vinculos_Apoio{})
	if err != nil {
		fmt.Println("Failed to migrate SAVe_Vinculos_Apoio:", err)
	} else {
		fmt.Println("Migration complete for SAVe_Vinculos_Apoio")
	}
}
