package main

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SAVe_Identificacao struct {
	ID_Caso         int        `gorm:"primaryKey;column:\"ID_Caso\""`
	Nome_RC         string     `gorm:"column:\"Nome_RC\""`
	Data_nascimento *time.Time `gorm:"column:\"Data_nascimento\""`
}

func (SAVe_Identificacao) TableName() string {
	return "\"SAVe_Identificacao\""
}

func main() {
	dsn := "host=localhost user=postgres password=postgres dbname=save_db port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect:", err)
	}

	var result SAVe_Identificacao
	err = db.First(&result, 6).Error
	if err != nil {
		fmt.Println("Error querying SAVe_Identificacao:", err)
	} else {
		fmt.Println("Success querying SAVe_Identificacao:", result)
	}
}
