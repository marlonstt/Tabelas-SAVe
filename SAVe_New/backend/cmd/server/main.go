package main

import (
	"fmt"
	"log"
	"os"

	"save-backend/internal/database"
	"save-backend/internal/handlers"
	"save-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	fmt.Fprintf(os.Stderr, "SERVER STARTING - DEBUG BUILD\n")
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Connect to DB
	database.Connect()

	r := gin.Default()

	// Global Logging Middleware
	r.Use(func(c *gin.Context) {
		fmt.Fprintf(os.Stderr, "INCOMING REQUEST: %s %s\n", c.Request.Method, c.Request.URL.Path)
		c.Next()
	})

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

		// Protected routes
		auth := api.Group("/")
		auth.Use(middleware.AuthMiddleware())
		{
			auth.POST("/change-password", handlers.ChangePassword)
			auth.POST("/update-profile-image", handlers.UpdateProfileImage)

			// Admin routes
			admin := auth.Group("/admin")
			admin.Use(middleware.AdminMiddleware())
			{
				admin.GET("/users", handlers.GetUsers)
				admin.POST("/users", handlers.Register)
				admin.PUT("/users/:id", handlers.UpdateUser)
				admin.DELETE("/users/:id", handlers.DeleteUser)

				// Responsaveis routes
				admin.GET("/responsaveis", handlers.GetResponsaveis)
				admin.POST("/responsaveis", handlers.CreateResponsavel)
				admin.PUT("/responsaveis/:id", handlers.UpdateResponsavel)
				admin.DELETE("/responsaveis/:id", handlers.DeleteResponsavel)
			}

			cases := auth.Group("/cases")
			{
				cases.GET("", handlers.GetAllCases)
				cases.POST("", handlers.CreateCase)
				cases.GET("/:id", handlers.GetCaseById)
				cases.DELETE("/:id", handlers.DeleteCase)
				cases.PUT("/:id/archive", handlers.ArchiveCase)
				cases.PUT("/:id/reopen", handlers.ReopenCase)
				cases.PUT("/:id/:section", handlers.UpdateCaseSection)
			}
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
