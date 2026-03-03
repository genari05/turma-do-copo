package players

import (
	"database/sql"
	"errors"
)

type Repository interface {
	List() ([]Player, error)
	GetByID(id string) (Player, error)
	AddStats(playerID string, goalsDelta int, assistsDelta int) (Player, error)
	Create(p Player) (Player, error)
}

type repo struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repo{db: db}
}

func (r *repo) List() ([]Player, error) {
	const q = `
		SELECT id, name, position, photo_url, goals, assists, created_at, updated_at
		FROM players
		ORDER BY name ASC;
	`

	rows, err := r.db.Query(q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	players := make([]Player, 0) // <- garante [] e não null
	for rows.Next() {
		var p Player
		err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Position,
			&p.PhotoURL,
			&p.Goals,
			&p.Assists,
			&p.CreatedAt,
			&p.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		players = append(players, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return players, nil
}

func (r *repo) GetByID(id string) (Player, error) {
	const q = `
		SELECT id, name, position, photo_url, goals, assists, created_at, updated_at
		FROM players
		WHERE id = $1;
	`

	var p Player
	err := r.db.QueryRow(q, id).Scan(
		&p.ID,
		&p.Name,
		&p.Position,
		&p.PhotoURL,
		&p.Goals,
		&p.Assists,
		&p.CreatedAt,
		&p.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return Player{}, sql.ErrNoRows
		}
		return Player{}, err
	}

	return p, nil
}

func (r *repo) AddStats(playerID string, goalsDelta int, assistsDelta int) (Player, error) {
	const q = `
		UPDATE players
		SET
			goals = goals + $1,
			assists = assists + $2,
			updated_at = now()
		WHERE id = $3
		RETURNING id, name, position, photo_url, goals, assists, created_at, updated_at;
	`

	var p Player
	err := r.db.QueryRow(q, goalsDelta, assistsDelta, playerID).Scan(
		&p.ID,
		&p.Name,
		&p.Position,
		&p.PhotoURL,
		&p.Goals,
		&p.Assists,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
	if err != nil {
		return Player{}, err
	}

	return p, nil
}

func (r *repo) Create(p Player) (Player, error) {
	const q = `
		INSERT INTO players (name, position, photo_url, goals, assists)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, name, position, photo_url, goals, assists, created_at, updated_at;
	`

	var out Player
	err := r.db.QueryRow(q, p.Name, p.Position, p.PhotoURL, p.Goals, p.Assists).Scan(
		&out.ID,
		&out.Name,
		&out.Position,
		&out.PhotoURL,
		&out.Goals,
		&out.Assists,
		&out.CreatedAt,
		&out.UpdatedAt,
	)
	if err != nil {
		return Player{}, err
	}

	return out, nil
}
