package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()
	var count int64
	database.DB.Model(&models.SAVe_Responsaveis{}).Count(&count)
	fmt.Printf("SAVe_Responsaveis count: %d\n", count)
}
