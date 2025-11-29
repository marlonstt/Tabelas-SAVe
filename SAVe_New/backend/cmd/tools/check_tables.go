package main

import (
	"fmt"
	"log"
	"save-backend/internal/database"
	"save-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	database.DB = db

	checkTable("SAVe_Vinculos_Apoio", &models.SAVe_Vinculos_Apoio{})
}

func checkTable(tableName string, model interface{}) {
	fmt.Printf("Checking table: %s\n", tableName)

	// Get columns
	cols, err := database.DB.Migrator().ColumnTypes(model)
	if err != nil {
		fmt.Printf("Error getting columns for %s: %v\n", tableName, err)
		return
	}

	existingCols := make(map[string]bool)
	for _, col := range cols {
		existingCols[col.Name()] = true
		fmt.Printf("Found DB Column: '%s'\n", col.Name())
	}

	// Check against struct fields
	stmt := &gorm.Statement{DB: database.DB}
	stmt.Parse(model)

	for _, field := range stmt.Schema.Fields {
		fmt.Printf("Struct Field: '%s' -> DBName: '%s'\n", field.Name, field.DBName)
		if !existingCols[field.DBName] {
			fmt.Printf("Column MISSING: %s\n", field.DBName)
		}
	}
	fmt.Println("------------------------------------------------")
}
