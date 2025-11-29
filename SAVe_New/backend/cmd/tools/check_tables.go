package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	database.Connect()

	model := &models.SAVe_Ensino_trab_renda{}
	tableName := model.TableName()
	fmt.Println("Checking table:", tableName)

	cols, err := database.DB.Migrator().ColumnTypes(model)
	if err != nil {
		fmt.Println("Error getting columns:", err)
	} else {
		requiredCols := []string{
			"Grau_escolaridade",
			"Estuda_atualmente",
			"Nome_instituicao",
			"Tipo_instituicao",
			"Retorno_estudos",
			"Situacao_trabalho",
			"Profissao",
			"Valor_renda",
			"Valor_renda_esp",
			"TR_Prejuizo_trabalho",
			"TR_tipo_prejuizo",
			"TR_descricao_prejuizo",
			"PT_prejuizo_patrimonio",
			"PT_Descricao_pp",
			"VE_prejuizo_escolar",
			"VE_tipo_PE",
			"VE_descricao_pe",
			"Demanda_educacional",
			"Desc_demanda_educacional",
			"Demanda_trabalhista",
			"Desc_demanda_trabalhista",
			"Esta_Afastado",
			"Motivo_afastamento",
			"Motivo_Afastamento_Detalhado",
		}
		existingCols := make(map[string]bool)
		for _, col := range cols {
			existingCols[col.Name()] = true
			// fmt.Println("Found column:", col.Name())
		}

		for _, req := range requiredCols {
			if existingCols[req] {
				fmt.Println("FOUND:", req)
			} else {
				fmt.Println("MISSING:", req)
			}
		}
	}
}
