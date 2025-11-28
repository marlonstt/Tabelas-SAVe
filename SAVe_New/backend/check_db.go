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

	var cases []SAVe_Geral
	if err := db.Find(&cases).Error; err != nil {
		log.Fatal("Failed to query save_geral:", err)
	}
	fmt.Println("Query successful. Count:", len(cases))

	// Check table name with quotes
	if err := db.Exec("SELECT 1 FROM \"SAVe_Geral\" LIMIT 1").Error; err != nil {
		fmt.Println("Table \"SAVe_Geral\" (quoted) access failed:", err)
	} else {
		fmt.Println("Table \"SAVe_Geral\" (quoted) access successful")
	}

	// Check table name without quotes
	if err := db.Exec("SELECT 1 FROM save_geral LIMIT 1").Error; err != nil {
		fmt.Println("Table save_geral (unquoted) access failed:", err)
	} else {
		fmt.Println("Table save_geral (unquoted) access successful")
	}
}
