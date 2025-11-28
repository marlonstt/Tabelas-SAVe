package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Query table structure
	var results []struct {
		ColumnName string
		DataType   string
		IsNullable string
	}

	db.Raw(`
		SELECT column_name, data_type, is_nullable 
		FROM information_schema.columns 
		WHERE table_name = 'save_usuarios'
		ORDER BY ordinal_position
	`).Scan(&results)

	fmt.Println("Table structure for save_usuarios:")
	fmt.Println("Column Name | Data Type | Nullable")
	fmt.Println("------------|-----------|----------")
	for _, r := range results {
		fmt.Printf("%s | %s | %s\n", r.ColumnName, r.DataType, r.IsNullable)
	}
}
