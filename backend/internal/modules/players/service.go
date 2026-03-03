package players

type Service interface {
	ListPlayers() ([]Player, error)
	GetPlayer(id string) (Player, error)
	AddPlayerStats(id string, goalsDelta int, assistsDelta int) (Player, error)

	CreatePlayer(name, position, photoURL string) (Player, error)
	UpdatePlayer(id, name, position, photoURL string) (Player, error)
	DeletePlayer(id string) (Player, error) // retorna o jogador deletado (pra pegar photo_url)
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

// Update: se photoURL vier "", mantém a foto atual
func (s *service) UpdatePlayer(id, name, position, photoURL string) (Player, error) {
	if id == "" || name == "" || position == "" {
		return Player{}, ErrInvalidPlayer
	}
	return s.repo.Update(id, name, position, photoURL)
}

// Delete: retorna o jogador deletado (inclusive photo_url)
func (s *service) DeletePlayer(id string) (Player, error) {
	if id == "" {
		return Player{}, ErrInvalidPlayer
	}
	return s.repo.Delete(id)
}
