package players

import (
	"database/sql"

	"github.com/genari05/turma-do-copo/internal/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	controller := NewController(service)

	grupo := r.Group("/players")
	{
		// público
		grupo.GET("", controller.List)
		grupo.GET("/:id", controller.GetByID)

		// admin
		admin := grupo.Group("")
		admin.Use(middleware.RequireAdmin())
		{
			admin.POST("", controller.Create)
			admin.PUT("/:id", controller.Update)
			admin.DELETE("/:id", controller.Delete)
			admin.POST("/:id/stats", controller.AddStats)
		}
	}
}
