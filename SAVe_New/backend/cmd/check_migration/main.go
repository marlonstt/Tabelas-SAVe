package main

import (
	"fmt"
	"io"
	"log"
	"os"
	"save-backend/internal/database"
	"save-backend/internal/models"
)

func main() {
	// Initialize Database
	database.Connect()
	if !database.Connected {
		log.Fatal("Could not connect to database.")
	}

	f, err := os.Create("migration_counts_utf8.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	// Check counts for each table
	checkCount(f, "SAVe_Geral", &models.SAVe_Geral{})
	checkCount(f, "SAVe_Identificacao", &models.SAVe_Identificacao{})
	checkCount(f, "SAVe_Identificacao_telefone", &models.SAVe_Identificacao_telefone{})
	checkCount(f, "SAVe_Identificacao_email", &models.SAVe_Identificacao_email{})
	checkCount(f, "SAVe_Identificacao_endereco", &models.SAVe_Identificacao_endereco{})
	checkCount(f, "SAVe_DadosDeEntrada", &models.SAVe_DadosDeEntrada{})
	checkCount(f, "SAVe_Encerramento", &models.SAVe_Encerramento{})
	checkCount(f, "SAVe_Casos_Vinculados", &models.SAVe_Casos_Vinculados{})
	checkCount(f, "SAVe_Situacao_Juridica", &models.SAVe_Situacao_Juridica{})
	checkCount(f, "SAVe_Situacao_Juridica2", &models.SAVe_Situacao_Juridica2{})
	checkCount(f, "SAVe_Situacao_Juridica_Incluir_processo", &models.SAVe_Situacao_Juridica_Incluir_processo{})
	checkCount(f, "SAVe_Saude", &models.SAVe_Saude{})
	checkCount(f, "SAVe_Habitacao_territorio", &models.SAVe_Habitacao_territorio{})
	checkCount(f, "SAVe_Assistencia", &models.SAVe_Assistencia{})
	checkCount(f, "SAVe_Ensino_trab_renda", &models.SAVe_Ensino_trab_renda{})
	checkCount(f, "SAVe_Vinculos", &models.SAVe_Vinculos{})
	checkCount(f, "SAVe_Vinculos_Apoio", &models.SAVe_Vinculos_Apoio{})
	checkCount(f, "SAVe_protecao_seguranca", &models.SAVe_protecao_seguranca{})
	checkCount(f, "SAVe_protecao_seguranca_ameacadores", &models.SAVe_protecao_seguranca_ameacadores{})
	checkCount(f, "SAVe_protecao_seguranca_adolescente", &models.SAVe_protecao_seguranca_adolescente{})
	checkCount(f, "SAVe_Acompanhamentos", &models.SAVe_Acompanhamentos{})
	checkCount(f, "SAVe_Vitimizacao", &models.SAVe_Vitimizacao{})
	checkCount(f, "SAVe_Perfil_Agressor", &models.SAVe_Perfil_Agressor{})
	checkCount(f, "SAVe_Perfil_Agressor_Endereco", &models.SAVe_Perfil_Agressor_Endereco{})
	checkCount(f, "SAVe_Sintese_Analitica", &models.SAVe_Sintese_Analitica{})
	checkCount(f, "SAVe_Usuarios", &models.SAVe_Usuarios{})
}

func checkCount(w io.Writer, tableName string, model interface{}) {
	var count int64
	if err := database.DB.Model(model).Count(&count).Error; err != nil {
		fmt.Fprintf(w, "Error counting records for %s: %v\n", tableName, err)
	} else {
		fmt.Fprintf(w, "Table %s: %d records\n", tableName, count)
	}
}
