package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/genari05/turma-do-copo/internal/config"
	"github.com/genari05/turma-do-copo/internal/db"
	"github.com/genari05/turma-do-copo/internal/middleware"
	"github.com/genari05/turma-do-copo/internal/modules/players"
)

func main() {
	_ = godotenv.Load() // carrega .env se existir (local)

	cfg := config.Load()

	database, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()
	r.Use(middleware.CORS())
	players.RegisterRoutes(r, database)

	_ = r.Run(":" + cfg.Port)
}
