package main

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Initialize strict connection to avoid using the shared internal/database global if needed,
	// but reusing the logic is easier.
	// We will manually load env if empty for verification
	if os.Getenv("DB_HOST") == "" {
		os.Setenv("DB_HOST", "localhost")
		os.Setenv("DB_USER", "postgres")
		os.Setenv("DB_PASSWORD", "86076448")
		os.Setenv("DB_NAME", "save_db")
		os.Setenv("DB_PORT", "5432")
	}

	// Connect manually to ensure we control the connection
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect:", err)
	}

	fmt.Println("Connected. Inspecting SAVe_Assistencia columns...")

	type ColumnInfo struct {
		ColumnName string
		DataType   string
	}

	var columns []ColumnInfo
	// Query information_schema
	err = db.Raw(`
		SELECT column_name, data_type 
		FROM information_schema.columns 
		WHERE table_name = 'SAVe_Assistencia'
        ORDER BY column_name
	`).Scan(&columns).Error

	if err != nil {
		log.Fatal("Query failed:", err)
	}

	fmt.Printf("Found %d columns:\n", len(columns))
	for _, col := range columns {
		fmt.Printf("- %s (%s)\n", col.ColumnName, col.DataType)
	}
}
