package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	// Mimic GetAllCases logic
	var cases []models.SAVe_Geral
	database.DB.Order("\"ID_Caso\" desc").Limit(5).Find(&cases)

	type ExtraDetails struct {
		ID_Caso            int
		N_procedimento_MPE string
		Comarca_origem     string
	}
	var details []ExtraDetails
	database.DB.Table("\"SAVe_DadosDeEntrada\"").Select("\"ID_Caso\", \"N_procedimento_MPE\", \"Comarca_origem\"").Find(&details)

	detailsMap := make(map[int]ExtraDetails)
	for _, d := range details {
		detailsMap[d.ID_Caso] = d
	}

	fmt.Println("--- Verification ---")
	for _, c := range cases {
		originalComarca := c.Comarca
		newComarca := originalComarca

		if detail, ok := detailsMap[c.ID_Caso]; ok {
			if detail.Comarca_origem != "" {
				newComarca = detail.Comarca_origem
			}
		}

		fmt.Printf("ID: %d | Original Comarca: '%s' | New Comarca: '%s'\n", c.ID_Caso, originalComarca, newComarca)
	}
}
