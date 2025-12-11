package main

import (
	"fmt"
	"log"
	"save-backend/internal/database"

	"github.com/joho/godotenv"
)

type SAVe_SinteseAnalitica struct {
	ID_Caso           int    `gorm:"primaryKey;column:\"ID_Caso\"" json:"ID_Caso"`
	Unidade_Analitica string `gorm:"column:\"Unidade_Analitica\"" json:"Unidade_Analitica"`
	Avaliacao_Riscos  string `gorm:"column:\"Avaliacao_Riscos\"" json:"Avaliacao_Riscos"`
	Plano_Prevencao   string `gorm:"column:\"Plano_Prevencao\"" json:"Plano_Prevencao"`
	Data_Vencimento   string `gorm:"column:\"Data_Vencimento\"" json:"Data_Vencimento"`
	Cor_Risco         string `gorm:"column:\"Cor_Risco\"" json:"Cor_Risco"`
}

func (SAVe_SinteseAnalitica) TableName() string {
	return "\"SAVe_SinteseAnalitica\""
}

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to DB
	database.Connect()

	fmt.Println("Creating SAVe_SinteseAnalitica table...")

	// AutoMigrate
	if err := database.DB.AutoMigrate(&SAVe_SinteseAnalitica{}); err != nil {
		log.Fatalf("Failed to migrate: %v", err)
	}

	// Add FK constraint manually to be safe
	database.DB.Exec(`ALTER TABLE "SAVe_SinteseAnalitica" ADD CONSTRAINT fk_sintese_geral FOREIGN KEY ("ID_Caso") REFERENCES "SAVe_Geral"("ID_Caso") ON DELETE CASCADE;`)
	fmt.Println("✅ Table SAVe_SinteseAnalitica created successfully!")
}
