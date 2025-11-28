package database

import (
	"log"

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
}
