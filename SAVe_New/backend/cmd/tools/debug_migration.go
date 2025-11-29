package main

import (
	"log"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	// Explicitly add missing columns for SAVe_Assistencia
	model := &models.SAVe_Assistencia{}
	columns := []string{
		"SPSEAC_Modalidade_acolhimentoInst",
		"SPSEAC_Inserido_acolhimentoInst",
		"SPSEAC_Inserido_acolhimentorep",
		"SPSEAC_acolhimentorep_desc",
		"SPSEAC_Inserido_familia",
		"SPSEAC_nome_familia",
		"SPSEAC_Inserido_calamidade",
		"SPSEAC_desc_calamidade",
		"SPSEAC_tec_ref_nome",
		"SPSEAC_tec_ref_tel",
		"SPSEAC_tec_ref_email",
		"SPSEAC_nome_servico",
		"SPSEAC_endereco_servico",
	}

	for _, col := range columns {
		if !database.DB.Migrator().HasColumn(model, col) {
			err := database.DB.Migrator().AddColumn(model, col)
			if err != nil {
				log.Printf("Failed to add column %s: %v", col, err)
			} else {
				log.Printf("Added column %s", col)
			}
		} else {
			log.Printf("Column %s already exists", col)
		}
	}

	log.Println("Migration check completed")
}
