package main

import (
	"fmt"
	"os"
	"save-backend/internal/database"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.Connect()

	tables := []string{
		"SAVe_Geral", "SAVe_DadosDeEntrada", "SAVe_Identificacao",
		"SAVe_Situacao_Juridica", "SAVe_Saude", "SAVe_Habitacao_territorio",
		"SAVe_Assistencia", "SAVe_Ensino_trab_renda", "SAVe_Vinculos",
		"SAVe_protecao_seguranca", "SAVe_Vitimizacao", "SAVe_Agressor",
		"SAVe_Encerramento", "SAVe_Acompanhamentos", "users",
	}

	fmt.Println("BANCO:", os.Getenv("DB_NAME"), "- HOST:", os.Getenv("DB_HOST"))
	fmt.Println("\nTABELAS:")

	missing := []string{}
	for _, table := range tables {
		var exists bool
		query := fmt.Sprintf("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '%s')", table)
		database.DB.Raw(query).Scan(&exists)

		if exists {
			fmt.Println("OK", table)
		} else {
			fmt.Println("FALTA", table)
			missing = append(missing, table)
		}
	}

	if len(missing) > 0 {
		fmt.Println("\nFALTANDO:", missing)
	} else {
		fmt.Println("\nTODAS AS TABELAS EXISTEM - USANDO BANCO REAL")
	}
}
