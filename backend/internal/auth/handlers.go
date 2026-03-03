package auth

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const cookieName = "tdc_session"

func isProd() bool {
	return os.Getenv("RENDER") != "" || strings.ToLower(os.Getenv("ENV")) == "production"
}

func Login(c *gin.Context) {
	var body struct {
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "json inválido"})
		return
	}

	if os.Getenv("ADMIN_PASSWORD") == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ADMIN_PASSWORD não definido"})
		return
	}

	if body.Password != os.Getenv("ADMIN_PASSWORD") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "senha inválida"})
		return
	}

	token, err := IssueAdminToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	secure := isProd()

	// ✅ se você chama o Render direto (domínios diferentes), precisa None
	sameSite := http.SameSiteNoneMode

	// ✅ se você estiver usando proxy /api no Vercel, pode usar Lax:
	// sameSite := http.SameSiteLaxMode

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     cookieName,
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		MaxAge:   7 * 24 * 3600,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
	})

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": "admin"}})
}

func Logout(c *gin.Context) {
	secure := isProd()
	sameSite := http.SameSiteNoneMode

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     cookieName,
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"ok": true}})
}

func Me(c *gin.Context) {
	cookie, err := c.Request.Cookie(cookieName)
	if err != nil || cookie.Value == "" {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": "visitor"}})
		return
	}

	claims, err := ParseToken(cookie.Value)
	if err != nil || claims.Role == "" {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": "visitor"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"role": claims.Role}})
}
