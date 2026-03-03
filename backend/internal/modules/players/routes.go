package players

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, db *sql.DB) {
	repo := NewRepository(db)
	svc := NewService(repo)
	ctl := NewController(svc)

	group := r.Group("/players")
	{
		group.GET("", ctl.List)
		group.GET("/:id", ctl.GetByID)
		group.POST("", ctl.Create)
		group.POST("/:id/stats", ctl.AddStats)
	}
}
