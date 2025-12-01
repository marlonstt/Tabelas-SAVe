package main

import (
\t"fmt"
\t"log"

\t"github.com/y00rb1-zer0/save-backend/internal/config"
\t"gorm.io/driver/postgres"
\t"gorm.io/gorm"
)

func main() {
\t// Load configuration
\tcfg := config.LoadConfig()

\t// Connect to database
\tdsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
\t\tcfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)

\tdb, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
\tif err != nil {
\t\tlog.Fatalf("Failed to connect to database: %v", err)
\t}

\tlog.Println("Connected to database successfully")

\t// Add missing columns to SAVe_Situacao_Juridica table
\tlog.Println("Adding missing columns to SAVe_Situacao_Juridica table...")

\tqueries := []string{
\t\t`ALTER TABLE "SAVe_Situacao_Juridica" ADD COLUMN IF NOT EXISTS "SJ_Hora_Crime" TEXT`,
\t\t`ALTER TABLE "SAVe_Situacao_Juridica" ADD COLUMN IF NOT EXISTS "SJ_Dia_Semana" TEXT`,
\t\t`ALTER TABLE "SAVe_Situacao_Juridica" ADD COLUMN IF NOT EXISTS "SJ_Local_Crime" TEXT`,
\t\t`ALTER TABLE "SAVe_Situacao_Juridica" ADD COLUMN IF NOT EXISTS "SJ_Local_Crime_Especif" TEXT`,
\t\t`ALTER TABLE "SAVe_Situacao_Juridica" ADD COLUMN IF NOT EXISTS "SJ_Obs_Crime" TEXT`,
\t}

\tfor _, query := range queries {
\t\tlog.Printf("Executing: %s", query)
\t\tif err := db.Exec(query).Error; err != nil {
\t\t\tlog.Printf("Error executing query: %v", err)
\t\t} else {
\t\t\tlog.Println("Success!")
\t\t}
\t}

\tlog.Println("\\nVerifying columns...")
\tvar columns []struct {
\t\tColumnName string
\t\tDataType   string
\t}

\tdb.Raw(`
\t\tSELECT column_name, data_type 
\t\tFROM information_schema.columns 
\t\tWHERE table_name = 'SAVe_Situacao_Juridica' 
\t\tAND column_name IN ('SJ_Hora_Crime', 'SJ_Dia_Semana', 'SJ_Local_Crime', 'SJ_Local_Crime_Especif', 'SJ_Obs_Crime')
\t\tORDER BY column_name
\t`).Scan(&columns)

\tlog.Printf("Found %d columns:\\n", len(columns))
\tfor _, col := range columns {
\t\tlog.Printf("  - %s (%s)\\n", col.ColumnName, col.DataType)
\t}

\tlog.Println("\\nMigration completed successfully!")
}
