package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	// Fetch a few cases from SAVe_Geral
	var geral []models.SAVe_Geral
	database.DB.Limit(5).Find(&geral)

	fmt.Println("--- SAVe_Geral ---")
	for _, g := range geral {
		fmt.Printf("ID: %d, Num_Processo: '%s'\n", g.ID_Caso, g.Num_Processo)

		// Check corresponding SAVe_DadosDeEntrada
		var dados models.SAVe_DadosDeEntrada
		database.DB.Where("\"ID_Caso\" = ?", g.ID_Caso).First(&dados)
		fmt.Printf("   -> DadosDeEntrada.N_procedimento_MPE: '%s'\n", dados.N_procedimento_MPE)
	}
}
