package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/models"

	"gorm.io/gorm"
)

func main() {
	database.Connect()

	stmt := &gorm.Statement{DB: database.DB}
	stmt.Parse(&models.SAVe_Situacao_Juridica2{})
	fmt.Println("Table name:", stmt.Schema.Table)

	// Check if table exists
	exists := database.DB.Migrator().HasTable(&models.SAVe_Situacao_Juridica2{})
	fmt.Println("Table exists:", exists)
}
