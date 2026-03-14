package cmd

import (
	"fmt"
	"log"
	"menu-tree-backend/internal/config"
	"menu-tree-backend/internal/controllers"
	"menu-tree-backend/internal/domain/model"
	"menu-tree-backend/internal/repositories"
	"menu-tree-backend/internal/routes"
	"menu-tree-backend/internal/services"
	"net/http"
	"time"

	_ "menu-tree-backend/docs" // Ignore swagger docs

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/spf13/cobra"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Menu Tree Backend API
// @version 1.0
// @description This is a sample API for managing a menu tree.
// @host localhost:8080
// @BasePath /api/v1
// @schemes http

var command = &cobra.Command{
	Use:   "serve",
	Short: "Start the server",
	Run: func(c *cobra.Command, args []string) {
		_ = godotenv.Load()
		db, err := config.InitDB()
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}

		loc, err := time.LoadLocation("Asia/Jakarta")
		if err != nil {
			panic(err)
		}

		time.Local = loc

		err = db.AutoMigrate(
			&model.Menu{},
		)
		if err != nil {
			log.Fatalf("failed to migrate database: %v", err)
		}

		// INTERNAL SYSTEM
		repository := repositories.NewRepositoryRegistry(db)
		service := services.NewServiceRegistry(repository)
		controller := controllers.NewControllerRegistry(service)

		router := gin.Default()
		router.NoRoute(func(c *gin.Context) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Not Found"})
		})

		router.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})

		router.Use(func(c *gin.Context) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-service-name, x-api-key, x-request-at")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE")
			if c.Request.Method == "OPTIONS" {
				c.AbortWithStatus(204)
				return
			}
			c.Next()
		})

		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

		group := router.Group("/api/v1")
		route := routes.NewRouteRegistry(controller, group)
		route.Serve()

		port := fmt.Sprintf(":%d", 8080)
		router.Run(port)
	},
}

func Run() {
	err := command.Execute()
	if err != nil {
		panic(err)
	}
}
