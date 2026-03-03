package players

import "time"

type Player struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Position  string    `json:"position"`
	PhotoURL  string    `json:"photo_url"`
	Goals     int       `json:"goals"`
	Assists   int       `json:"assists"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
