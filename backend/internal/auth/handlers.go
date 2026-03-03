package auth

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

const cookieName = "tdc_session"

var loginLimiter = NewLimiter(8, 2*time.Minute) // 8 tentativas / 2min por IP

func Login(c *gin.Context) {
	// rate limit por IP
	ip := c.ClientIP()
	if !loginLimiter.Allow(ip) {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "muitas tentativas, aguarde um pouco"})
		return
	}

	var body struct {
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "json inválido"})
		return
	}

	expected := os.Getenv("ADMIN_PASSWORD")
	if expected == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ADMIN_PASSWORD não definido"})
		return
	}

	if body.Password != expected {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "senha incorreta"})
		return
	}

	token, err := IssueAdminToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "falha ao criar sessão"})
		return
	}

	// Cookie HttpOnly (JS não lê)
	secure := false // em produção com HTTPS: true
	c.SetCookie(cookieName, token, 7*24*3600, "/", "", secure, true)

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": "admin"}})
}

func Logout(c *gin.Context) {
	secure := false
	// expira cookie
	c.SetCookie(cookieName, "", -1, "/", "", secure, true)
	c.JSON(http.StatusOK, gin.H{"data": gin.H{"ok": true}})
}

func Me(c *gin.Context) {
	token, err := c.Cookie(cookieName)
	if err != nil || token == "" {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": "visitor"}})
		return
	}

	claims, err := ParseToken(token)
	if err != nil || claims.Role != "admin" {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": "visitor"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": "admin"}})
}
