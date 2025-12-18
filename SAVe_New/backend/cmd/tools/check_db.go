package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SAVe_Geral struct {
	ID_Caso int `gorm:"primaryKey;column:ID_Caso"`
}

func (SAVe_Geral) TableName() string {
	return "save_geral"
}

func main() {
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect:", err)
	}
	fmt.Println("Connected successfully")

	// List all tables
	var tables []string
	db.Raw("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'").Scan(&tables)
	fmt.Println("Existing tables:")
	for _, t := range tables {
		fmt.Println("- " + t)
	}

	// Test variations
	variations := []string{
		"\"SAVe_Geral\"",
		"save_geral",
		"\"save_geral\"",
		"SAVe_Geral",
	}

	for _, v := range variations {
		err := db.Exec(fmt.Sprintf("SELECT 1 FROM %s LIMIT 1", v)).Error
		if err != nil {
			fmt.Printf("Access failed for %s: %v\n", v, err)
		} else {
			fmt.Printf("Access SUCCESS for %s\n", v)
		}
	}
}
