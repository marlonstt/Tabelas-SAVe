package database

import (
	"log"

	"save-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB
var Connected bool

func Connect() {
	// Hardcoded for reliability in this environment
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Println("ERROR: Failed to connect to database:", err)
		log.Println("WARNING: Running in Offline/Mock Mode")
		Connected = false
		return
	}

	log.Println("Connected to database successfully")
	Connected = true

	// AutoMigrate
	err = DB.AutoMigrate(
		&models.SAVe_Geral{},
		&models.SAVe_DadosDeEntrada{},
		&models.SAVe_Casos_Vinculados{},
		&models.SAVe_Identificacao{},
		&models.SAVe_Identificacao_endereco{},
		&models.SAVe_Identificacao_telefone{},
		&models.SAVe_Identificacao_email{},
		&models.SAVe_Situacao_Juridica{},
		&models.SAVe_Situacao_Juridica2{},
		&models.SAVe_Situacao_Juridica_Incluir_processo{},
		&models.SAVe_Encerramento{},
		&models.SAVe_Saude{},
		&models.SAVe_Habitacao_territorio{},
		&models.SAVe_Assistencia{},
		&models.SAVe_Ensino_trab_renda{},
		&models.SAVe_Vinculos{},
		&models.SAVe_Vinculos_Apoio{},
		&models.SAVe_protecao_seguranca{},
		&models.SAVe_protecao_seguranca_ameacadores{},
		&models.SAVe_protecao_seguranca_adolescente{},
	)
	if err != nil {
		log.Println("ERROR: Failed to migrate database:", err)
	}
}
