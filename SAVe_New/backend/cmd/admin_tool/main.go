package main

import (
	"fmt"
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SAVe_Usuarios struct {
	ID                 int
	Email              string
	Password           string
	Role               string
	Usuario            string
	Cargo              string
	Area               string
	MustChangePassword bool
}

func (SAVe_Usuarios) TableName() string {
	return "save_usuarios"
}

func main() {
	// Hardcoded for reliability
	dsn := "host=localhost user=postgres password=86076448 dbname=save_db port=5432 sslmode=disable"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if len(os.Args) > 1 && os.Args[1] == "list" {
		var users []SAVe_Usuarios
		db.Find(&users)
		fmt.Println("ID | Email | Role")
		fmt.Println("---|---|---")
		for _, u := range users {
			fmt.Printf("%d | %s | %s\n", u.ID, u.Email, u.Role)
		}
	} else if len(os.Args) > 2 && os.Args[1] == "promote" {
		email := os.Args[2]
		var user SAVe_Usuarios
		if err := db.Where("Email = ?", email).First(&user).Error; err != nil {
			log.Fatal("User not found:", err)
		}
		user.Role = "Admin"
		db.Save(&user)
		fmt.Printf("User %s promoted to Admin\n", email)
	} else if len(os.Args) > 3 && os.Args[1] == "create" {
		email := os.Args[2]
		password := os.Args[3]

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("Failed to hash password:", err)
		}

		newUser := SAVe_Usuarios{
			Email:              email,
			Password:           string(hashedPassword),
			Role:               "Admin",
			Usuario:            "Admin User",
			Cargo:              "Promotora(o)",
			Area:               "Direito",
			MustChangePassword: true,
		}

		if err := db.Create(&newUser).Error; err != nil {
			log.Fatal("Failed to create user:", err)
		}
		fmt.Printf("User %s created successfully with Admin role.\n", email)
	} else if len(os.Args) > 3 && os.Args[1] == "reset-password" {
		email := os.Args[2]
		password := os.Args[3]

		var user SAVe_Usuarios
		if err := db.Where("Email = ?", email).First(&user).Error; err != nil {
			log.Fatal("User not found:", err)
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal("Failed to hash password:", err)
		}

		user.Password = string(hashedPassword)
		if err := db.Save(&user).Error; err != nil {
			log.Fatal("Failed to update password:", err)
		}
		fmt.Printf("Password for user %s updated successfully.\n", email)
	} else {
		fmt.Println("Usage:")
		fmt.Println("  go run main.go list")
		fmt.Println("  go run main.go promote <email>")
		fmt.Println("  go run main.go create <email> <password>")
		fmt.Println("  go run main.go reset-password <email> <password>")
	}
}
