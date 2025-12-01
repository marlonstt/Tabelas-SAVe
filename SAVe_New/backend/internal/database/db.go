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
	// Migrate EnsinoTrabRenda explicitly to ensure it's up to date
	// Manually add columns if they don't exist (workaround for AutoMigrate issues)
	DB.Exec("ALTER TABLE save_ensino_trab_renda ADD COLUMN IF NOT EXISTS created_at timestamp")
	DB.Exec("ALTER TABLE save_ensino_trab_renda ADD COLUMN IF NOT EXISTS updated_at timestamp")

	// Assistencia manual columns
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS created_at timestamp")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS updated_at timestamp")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_direito_beneficios\" text")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_direito_beneficios_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_demandas_assist\" text")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_demandas_assist_desc\" text")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_tec_ref_nome\" text")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_tec_ref_tel\" text")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_tec_ref_email\" text")
	DB.Exec("ALTER TABLE \"SAVe_Assistencia\" ADD COLUMN IF NOT EXISTS \"BSA_seg_alimentar\" text")

	// Habitacao Territorio manual columns
	DB.Exec("CREATE TABLE IF NOT EXISTS \"SAVe_Habitacao_territorio\" (\"ID_Caso\" integer primary key)")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Moradia_regular\" boolean")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Moradia_regular_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Moradia_Irregular\" boolean")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Moradia_Irregular_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Moradia_Emergencial\" boolean")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Moradia_Emergencial_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Territorio\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Comunidade_tradicional\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Comunidade_tradicional_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Reconhecido_fund_palmares\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Reconhecido_orgao_publico\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Reconhecido_funai\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"titulado_Incra\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"titulado_incra\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Mat_predominante\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Mat_predominante_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Insta_eletricas_hidraulica\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Insta_eletricas_hidraulica_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_paredes_revesti\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_danos_eventos_naturais\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_danos_eventos_naturais_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Risco_geologico\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Risco_geologico_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Acesso_internet\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Estrutura_Acesso_internet_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Fatores_risco_ambiental_infra\" boolean")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Fatores_risco_ambiental_infra_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Conflitos_Urbanos_Criminalidade\" boolean")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Conflitos_Urbanos_Criminalidade_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Conflitos_fundiarios_Agrarios\" boolean")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Conflitos_fundiarios_Agrarios_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Fatores_risco_outros\" boolean")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"Fatores_risco_outros_esp\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"RV_Mudanca_domicilio\" text")
	DB.Exec("ALTER TABLE \"SAVe_Habitacao_territorio\" ADD COLUMN IF NOT EXISTS \"RV_Mudanca_domicilio_esp\" text")

	if err := DB.AutoMigrate(&models.SAVe_Ensino_trab_renda{}, &models.SAVe_Assistencia{}); err != nil {
		log.Println("ERROR: Failed to migrate SAVe_Ensino_trab_renda or SAVe_Assistencia:", err)
	}

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
		// &models.SAVe_Assistencia{}, // Migrated above
		// &models.SAVe_Ensino_trab_renda{}, // Migrated above
		&models.SAVe_Vinculos{},
		&models.SAVe_Vinculos_Apoio{},
		&models.SAVe_protecao_seguranca{},
		&models.SAVe_protecao_seguranca_ameacadores{},
		&models.SAVe_protecao_seguranca_adolescente{},
	)
	if err != nil {
		log.Println("ERROR: Failed to migrate other tables:", err)
	}
}
