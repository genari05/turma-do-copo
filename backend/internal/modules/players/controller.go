package players

import (
	"database/sql"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/genari05/turma-do-copo/internal/shared"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Controller struct {
	service Service
}

func NewController(service Service) *Controller {
	return &Controller{service: service}
}

type AddStatsInput struct {
	GoalsDelta   int `json:"goals_delta"`
	AssistsDelta int `json:"assists_delta"`
}

func (ctl *Controller) List(c *gin.Context) {
	players, err := ctl.service.ListPlayers()
	if err != nil {
		shared.Error(c, http.StatusInternalServerError, "erro ao listar jogadores")
		return
	}
	shared.JSON(c, http.StatusOK, players)
}

func (ctl *Controller) GetByID(c *gin.Context) {
	id := c.Param("id")

	player, err := ctl.service.GetPlayer(id)
	if err != nil {
		if err == sql.ErrNoRows {
			shared.Error(c, http.StatusNotFound, "jogador não encontrado")
			return
		}
		shared.Error(c, http.StatusInternalServerError, "erro ao buscar jogador")
		return
	}

	shared.JSON(c, http.StatusOK, player)
}

func (ctl *Controller) AddStats(c *gin.Context) {
	id := c.Param("id")

	var input AddStatsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		shared.Error(c, http.StatusBadRequest, "json inválido")
		return
	}

	player, err := ctl.service.AddPlayerStats(id, input.GoalsDelta, input.AssistsDelta)
	if err != nil {
		if err == ErrInvalidDelta {
			shared.Error(c, http.StatusBadRequest, "valores negativos não permitidos")
			return
		}
		shared.Error(c, http.StatusInternalServerError, "erro ao atualizar estatísticas")
		return
	}

	shared.JSON(c, http.StatusOK, player)
}

// ✅ CREATE (multipart/form-data) com foto opcional
func (ctl *Controller) Create(c *gin.Context) {
	name := strings.TrimSpace(c.PostForm("name"))
	position := strings.TrimSpace(c.PostForm("position"))

	if name == "" || position == "" {
		shared.Error(c, http.StatusBadRequest, "name e position são obrigatórios")
		return
	}

	var photoURL string

	file, err := c.FormFile("photo")
	if err == nil && file != nil {
		ext := strings.ToLower(filepath.Ext(file.Filename))
		if ext == "" {
			ext = ".jpg"
		}

		filename := uuid.New().String() + ext
		savePath := filepath.Join("uploads", filename)

		if err := c.SaveUploadedFile(file, savePath); err != nil {
			shared.Error(c, http.StatusInternalServerError, "falha ao salvar foto")
			return
		}

		photoURL = "/uploads/" + filename
	}

	player, err := ctl.service.CreatePlayer(name, position, photoURL)
	if err != nil {
		if err == ErrInvalidPlayer {
			shared.Error(c, http.StatusBadRequest, "name e position são obrigatórios")
			return
		}
		shared.Error(c, http.StatusInternalServerError, "erro ao cadastrar jogador")
		return
	}

	shared.JSON(c, http.StatusCreated, player)
}
