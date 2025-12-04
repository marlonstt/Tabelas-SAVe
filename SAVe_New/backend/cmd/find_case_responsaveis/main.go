package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()
	var acomps []models.SAVe_Acompanhamentos
	database.DB.Where("LENGTH(\"Responsaveis\") > 0").Limit(5).Find(&acomps)

	fmt.Println("--- Cases with Responsaveis ---")
	for _, a := range acomps {
		fmt.Printf("ID_Caso: %d, Responsaveis: '%s'\n", a.ID_Caso, a.Responsaveis)
	}
}
