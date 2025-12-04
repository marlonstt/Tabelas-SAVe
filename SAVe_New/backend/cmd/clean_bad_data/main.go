package main

import (
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

	// Delete records with ID_Caso = 0
	cleanTable("SAVe_Geral", &models.SAVe_Geral{})
	cleanTable("SAVe_Identificacao", &models.SAVe_Identificacao{})
	cleanTable("SAVe_Identificacao_telefone", &models.SAVe_Identificacao_telefone{})
	cleanTable("SAVe_Identificacao_email", &models.SAVe_Identificacao_email{})
	cleanTable("SAVe_Identificacao_endereco", &models.SAVe_Identificacao_endereco{})
	cleanTable("SAVe_DadosDeEntrada", &models.SAVe_DadosDeEntrada{})
	cleanTable("SAVe_Encerramento", &models.SAVe_Encerramento{})
	cleanTable("SAVe_Casos_Vinculados", &models.SAVe_Casos_Vinculados{})
	cleanTable("SAVe_Situacao_Juridica", &models.SAVe_Situacao_Juridica{})
	cleanTable("SAVe_Situacao_Juridica2", &models.SAVe_Situacao_Juridica2{})
	cleanTable("SAVe_Situacao_Juridica_Incluir_processo", &models.SAVe_Situacao_Juridica_Incluir_processo{})
	cleanTable("SAVe_Saude", &models.SAVe_Saude{})
	cleanTable("SAVe_Habitacao_territorio", &models.SAVe_Habitacao_territorio{})
	cleanTable("SAVe_Assistencia", &models.SAVe_Assistencia{})
	cleanTable("SAVe_Ensino_trab_renda", &models.SAVe_Ensino_trab_renda{})
	cleanTable("SAVe_Vinculos", &models.SAVe_Vinculos{})
	cleanTable("SAVe_Vinculos_Apoio", &models.SAVe_Vinculos_Apoio{})
	cleanTable("SAVe_protecao_seguranca", &models.SAVe_protecao_seguranca{})
	cleanTable("SAVe_protecao_seguranca_ameacadores", &models.SAVe_protecao_seguranca_ameacadores{})
	cleanTable("SAVe_protecao_seguranca_adolescente", &models.SAVe_protecao_seguranca_adolescente{})
	cleanTable("SAVe_Acompanhamentos", &models.SAVe_Acompanhamentos{})
	cleanTable("SAVe_Vitimizacao", &models.SAVe_Vitimizacao{})
	cleanTable("SAVe_Perfil_Agressor", &models.SAVe_Perfil_Agressor{})
	cleanTable("SAVe_Perfil_Agressor_Endereco", &models.SAVe_Perfil_Agressor_Endereco{})
	cleanTable("SAVe_Sintese_Analitica", &models.SAVe_Sintese_Analitica{})
	cleanTable("SAVe_Usuarios", &models.SAVe_Usuarios{})
}

func cleanTable(tableName string, model interface{}) {
	// Check if table has ID_Caso column
	if err := database.DB.Model(model).Where("\"ID_Caso\" = ?", 0).Delete(model).Error; err != nil {
		// Try without quotes
		if err2 := database.DB.Model(model).Where("ID_Caso = ?", 0).Delete(model).Error; err2 != nil {
			log.Printf("Error deleting from %s: %v", tableName, err2)
		} else {
			log.Printf("Cleaned %s", tableName)
		}
	} else {
		log.Printf("Cleaned %s", tableName)
	}
}
