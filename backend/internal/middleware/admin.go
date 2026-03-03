package middleware

import (
	"net/http"

	"github.com/genari05/turma-do-copo/internal/auth"
	"github.com/gin-gonic/gin"
)

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := c.Cookie("tdc_session")
		if err != nil || token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
			return
		}

		claims, err := auth.ParseToken(token)
		if err != nil || claims.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
			return
		}

		c.Next()
	}
}
