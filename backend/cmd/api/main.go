package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/genari05/turma-do-copo/internal/auth"
	"github.com/genari05/turma-do-copo/internal/db"
	"github.com/genari05/turma-do-copo/internal/middleware"
	"github.com/genari05/turma-do-copo/internal/modules/players"
)

func main() {
	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL não definida no .env")
	}

	database, err := db.Connect(dsn)
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.CORSMiddleware())

	r.Static("/uploads", "./uploads")

	r.POST("/auth/login", auth.Login)
	r.POST("/auth/logout", auth.Logout)
	r.GET("/auth/me", auth.Me)

	players.RegisterRoutes(r, database)

	_ = r.Run(":8080")
}
