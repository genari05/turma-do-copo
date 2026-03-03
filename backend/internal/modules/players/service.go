package players

import "errors"

var ErrInvalidDelta = errors.New("delta inválido")
var ErrInvalidPlayer = errors.New("jogador inválido")

type Service interface {
	ListPlayers() ([]Player, error)
	GetPlayer(id string) (Player, error)
	AddPlayerStats(id string, goalsDelta int, assistsDelta int) (Player, error)
	CreatePlayer(name, position, photoURL string) (Player, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) ListPlayers() ([]Player, error) {
	return s.repo.List()
}

func (s *service) GetPlayer(id string) (Player, error) {
	return s.repo.GetByID(id)
}

func (s *service) AddPlayerStats(id string, goalsDelta int, assistsDelta int) (Player, error) {
	if goalsDelta < 0 || assistsDelta < 0 {
		return Player{}, ErrInvalidDelta
	}
	return s.repo.AddStats(id, goalsDelta, assistsDelta)
}

func (s *service) CreatePlayer(name, position, photoURL string) (Player, error) {
	if name == "" || position == "" {
		return Player{}, ErrInvalidPlayer
	}

	p := Player{
		Name:     name,
		Position: position,
		PhotoURL: photoURL,
		Goals:    0,
		Assists:  0,
	}

	return s.repo.Create(p)
}
