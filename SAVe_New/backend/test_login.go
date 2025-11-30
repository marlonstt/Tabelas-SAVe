package main

import (
	"fmt"
	"save-backend/internal/database"
	"save-backend/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.Connect()

	// Test login
	fmt.Println("=== TESTE DE LOGIN ===\n")

	r := gin.Default()
	r.POST("/login", handlers.Login)

	// Start server in background
	go r.Run(":8081")

	fmt.Println("✅ Servidor de teste rodando na porta 8081")
	fmt.Println("\nPara testar o login, execute:")
	fmt.Println(`curl -X POST http://localhost:8081/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"`)
	fmt.Println("\nOu use o Postman/Insomnia para fazer POST em http://localhost:8081/login")
	fmt.Println("\nPressione Ctrl+C para sair")

	// Keep running
	select {}
}
