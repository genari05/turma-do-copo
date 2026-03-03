package players

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	controller := NewController(service)

	grupo := r.Group("/players")
	{
		grupo.GET("", controller.List)
		grupo.GET("/:id", controller.GetByID)
		grupo.POST("/:id/stats", controller.AddStats)

		// ✅ CREATE com upload (multipart/form-data)
		grupo.POST("", controller.Create)
	}
}
