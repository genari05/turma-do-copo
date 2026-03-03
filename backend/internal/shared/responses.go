package shared

import "github.com/gin-gonic/gin"

func JSON(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{"data": data})
}

func Error(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{"error": msg})
}
