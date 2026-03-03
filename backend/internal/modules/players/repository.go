package players

import "database/sql"

type Repository interface {
	List() ([]Player, error)
	GetByID(id string) (Player, error)

	AddStats(playerID string, goalsDelta int, assistsDelta int) (Player, error)

	Create(name, position, photoURL string) (Player, error)
}

type repo struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repo{db: db}
}

func (r *repo) List() ([]Player, error) {
	rows, err := r.db.Query(`
		SELECT id, name, position, goals, assists, photo_url
		FROM players
		ORDER BY name ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Player
	for rows.Next() {
		var p Player
		if err := rows.Scan(&p.ID, &p.Name, &p.Position, &p.Goals, &p.Assists, &p.PhotoURL); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

func (r *repo) GetByID(id string) (Player, error) {
	var p Player
	err := r.db.QueryRow(`
		SELECT id, name, position, goals, assists, photo_url
		FROM players
		WHERE id = $1
	`, id).Scan(&p.ID, &p.Name, &p.Position, &p.Goals, &p.Assists, &p.PhotoURL)

	return p, err
}

func (r *repo) AddStats(playerID string, goalsDelta int, assistsDelta int) (Player, error) {
	var p Player
	err := r.db.QueryRow(`
		UPDATE players
		SET goals = goals + $2,
		    assists = assists + $3
		WHERE id = $1
		RETURNING id, name, position, goals, assists, photo_url
	`, playerID, goalsDelta, assistsDelta).Scan(
		&p.ID, &p.Name, &p.Position, &p.Goals, &p.Assists, &p.PhotoURL,
	)
	return p, err
}

func (r *repo) Create(name, position, photoURL string) (Player, error) {
	var p Player
	err := r.db.QueryRow(`
		INSERT INTO players (name, position, goals, assists, photo_url)
		VALUES ($1, $2, 0, 0, $3)
		RETURNING id, name, position, goals, assists, photo_url
	`, name, position, photoURL).Scan(
		&p.ID, &p.Name, &p.Position, &p.Goals, &p.Assists, &p.PhotoURL,
	)
	return p, err
}
