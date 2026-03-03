package players

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
	return s.repo.Create(name, position, photoURL)
}
