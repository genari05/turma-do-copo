package players

import (
	"database/sql"
	"net/http"
	"os"
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

// CREATE com foto opcional via Cloudinary
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

		if err := os.MkdirAll("./temp", os.ModePerm); err != nil {
			shared.Error(c, http.StatusInternalServerError, "falha ao criar pasta temporária: "+err.Error())
			return
		}

		tempFilename := uuid.New().String() + ext
		tempPath := "./temp/" + tempFilename

		if err := c.SaveUploadedFile(file, tempPath); err != nil {
			shared.Error(c, http.StatusInternalServerError, "falha ao salvar arquivo temporário: "+err.Error())
			return
		}

		imageURL, err := shared.UploadToCloudinary(tempPath)
		_ = os.Remove(tempPath)

		if err != nil {
			shared.Error(c, http.StatusInternalServerError, "falha ao enviar foto para Cloudinary: "+err.Error())
			return
		}

		photoURL = imageURL
		println("=== CREATE NOVO COM CLOUDINARY ===")
		println("photoURL salva:", photoURL)
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

// UPDATE com JSON ou multipart/form-data
func (ctl *Controller) Update(c *gin.Context) {
	id := c.Param("id")

	var name string
	var position string
	var newPhotoURL string

	contentType := c.ContentType()

	if contentType == "application/json" {
		var body struct {
			Name     string `json:"name"`
			Position string `json:"position"`
		}

		if err := c.ShouldBindJSON(&body); err != nil {
			shared.Error(c, http.StatusBadRequest, "json inválido")
			return
		}

		name = strings.TrimSpace(body.Name)
		position = strings.TrimSpace(body.Position)
	} else {
		name = strings.TrimSpace(c.PostForm("name"))
		position = strings.TrimSpace(c.PostForm("position"))

		file, err := c.FormFile("photo")
		if err == nil && file != nil {
			ext := strings.ToLower(filepath.Ext(file.Filename))
			if ext == "" {
				ext = ".jpg"
			}

			if err := os.MkdirAll("./temp", os.ModePerm); err != nil {
				shared.Error(c, http.StatusInternalServerError, "falha ao criar pasta temporária: "+err.Error())
				return
			}

			tempFilename := uuid.New().String() + ext
			tempPath := "./temp/" + tempFilename

			if err := c.SaveUploadedFile(file, tempPath); err != nil {
				shared.Error(c, http.StatusInternalServerError, "falha ao salvar arquivo temporário: "+err.Error())
				return
			}

			imageURL, err := shared.UploadToCloudinary(tempPath)
			_ = os.Remove(tempPath)

			if err != nil {
				shared.Error(c, http.StatusInternalServerError, "falha ao enviar foto para Cloudinary: "+err.Error())
				return
			}

			newPhotoURL = imageURL
			println("=== UPDATE NOVO COM CLOUDINARY ===")
			println("newPhotoURL salva:", newPhotoURL)
		}
	}

	if id == "" || name == "" || position == "" {
		shared.Error(c, http.StatusBadRequest, "id, name e position são obrigatórios")
		return
	}

	_, err := ctl.service.GetPlayer(id)
	if err != nil {
		shared.Error(c, http.StatusNotFound, "jogador não encontrado")
		return
	}

	updated, err := ctl.service.UpdatePlayer(id, name, position, newPhotoURL)
	if err != nil {
		shared.Error(c, http.StatusInternalServerError, "erro ao atualizar jogador")
		return
	}

	shared.JSON(c, http.StatusOK, updated)
}

// DELETE: deleta jogador
func (ctl *Controller) Delete(c *gin.Context) {
	id := c.Param("id")

	deleted, err := ctl.service.DeletePlayer(id)
	if err != nil {
		if err == sql.ErrNoRows {
			shared.Error(c, http.StatusNotFound, "jogador não encontrado")
			return
		}
		shared.Error(c, http.StatusInternalServerError, "erro ao deletar jogador")
		return
	}

	shared.JSON(c, http.StatusOK, deleted)
}
