package auth

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

func secret() ([]byte, error) {
	s := os.Getenv("AUTH_SECRET")
	if len(s) < 16 {
		return nil, errors.New("AUTH_SECRET fraco ou não definido")
	}
	return []byte(s), nil
}

func IssueAdminToken() (string, error) {
	sec, err := secret()
	if err != nil {
		return "", err
	}

	now := time.Now()

	claims := Claims{
		Role: "admin",
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(7 * 24 * time.Hour)), // 7 dias
		},
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(sec)
}

func ParseToken(tokenStr string) (*Claims, error) {
	sec, err := secret()
	if err != nil {
		return nil, err
	}

	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (any, error) {
		return sec, nil
	})
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("token inválido")
	}
	return claims, nil
}
