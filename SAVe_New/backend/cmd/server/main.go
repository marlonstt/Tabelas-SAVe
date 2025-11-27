package main

import (
	"log"
	"os"

	"save-backend/internal/database"
	"save-backend/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to DB
	database.Connect()

	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Adjust for production
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Routes
	api := r.Group("/api")
	{
		api.POST("/login", handlers.Login)

		cases := api.Group("/cases")
		// Add middleware here if needed
		{
			cases.GET("", handlers.GetAllCases)
			cases.POST("", handlers.CreateCase)
			cases.GET("/:id", handlers.GetCaseById)
			// cases.PUT("/:id/:section", handlers.UpdateCaseSection)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
