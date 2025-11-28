package main

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SAVe_Usuarios struct {
	ID                 int    `gorm:"primaryKey;autoIncrement;column:ID"`
	Cargo              string `gorm:"column:Cargo"`
	Usuario            string `gorm:"column:Usuario"`
	Area               string `gorm:"column:Area"`
	Email              string `gorm:"unique;column:Email"`
	Password           string `gorm:"column:Password"`
	Role               string `gorm:"default:User;column:Role"`
	MustChangePassword bool   `gorm:"default:true;column:MustChangePassword"`
	ProfileImage       string `gorm:"column:ProfileImage"`
	Tema               string `gorm:"column:Tema;type:json"`
}

func (SAVe_Usuarios) TableName() string {
	return "save_usuarios"
}

func main() {
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the table
	if err := db.AutoMigrate(&SAVe_Usuarios{}); err != nil {
		log.Fatal("Failed to migrate table:", err)
	}

	fmt.Println("Table save_usuarios created/updated successfully!")
}
