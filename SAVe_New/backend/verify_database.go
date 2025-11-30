package main

import (
	"fmt"
	"log"
	"os"
	"save-backend/internal/database"
	"save-backend/internal/models"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to database
	database.Connect()

	fmt.Println("=== VERIFICAÇÃO DO BANCO DE DADOS ===\n")

	// 1. Check connection
	sqlDB, err := database.DB.DB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "❌ Erro ao obter conexão: %v\n", err)
		os.Exit(1)
	}

	if err := sqlDB.Ping(); err != nil {
		fmt.Fprintf(os.Stderr, "❌ Erro ao fazer ping no banco: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("✅ Conexão com banco de dados estabelecida")
	fmt.Printf("   Host: %s\n", os.Getenv("DB_HOST"))
	fmt.Printf("   Database: %s\n", os.Getenv("DB_NAME"))
	fmt.Printf("   User: %s\n\n", os.Getenv("DB_USER"))

	// 2. Check tables
	tables := []string{
		"SAVe_Geral",
		"SAVe_DadosDeEntrada",
		"SAVe_Identificacao",
		"SAVe_Situacao_Juridica",
		"SAVe_Saude",
		"SAVe_Habitacao_territorio",
		"SAVe_Assistencia",
		"SAVe_Ensino_trab_renda",
		"SAVe_Vinculos",
		"SAVe_protecao_seguranca",
		"SAVe_Vitimizacao",
		"SAVe_Agressor",
		"SAVe_Encerramento",
		"SAVe_Acompanhamentos",
		"users",
	}

	fmt.Println("=== VERIFICAÇÃO DE TABELAS ===\n")
	allExist := true

	for _, table := range tables {
		var exists bool
		query := fmt.Sprintf("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '%s')", table)
		if err := database.DB.Raw(query).Scan(&exists).Error; err != nil {
			fmt.Printf("❌ Erro ao verificar tabela %s: %v\n", table, err)
			allExist = false
		} else if exists {
			fmt.Printf("✅ Tabela %s existe\n", table)
		} else {
			fmt.Printf("❌ Tabela %s NÃO EXISTE\n", table)
			allExist = false
		}
	}

	fmt.Println()

	// 3. Check data
	var caseCount int64
	database.DB.Model(&models.SAVe_Geral{}).Count(&caseCount)
	fmt.Printf("📊 Total de casos no banco: %d\n", caseCount)

	var userCount int64
	database.DB.Table("users").Count(&userCount)
	fmt.Printf("👥 Total de usuários no banco: %d\n\n", userCount)

	if allExist {
		fmt.Println("✅ TODAS AS TABELAS NECESSÁRIAS EXISTEM")
		fmt.Println("✅ VOCÊ ESTÁ USANDO O BANCO DE DADOS REAL (NÃO MOCK)")
	} else {
		fmt.Println("⚠️  ALGUMAS TABELAS ESTÃO FALTANDO")
		fmt.Println("⚠️  Crie as tabelas faltantes antes de usar o sistema")
	}
}
