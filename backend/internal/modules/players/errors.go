package players

import "errors"

var (
	ErrInvalidDelta  = errors.New("delta inválido")
	ErrInvalidPlayer = errors.New("jogador inválido")
)
