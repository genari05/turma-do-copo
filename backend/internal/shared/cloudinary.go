package shared

import (
	"context"
	"errors"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadToCloudinary(filePath string) (string, error) {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return "", errors.New("variáveis do Cloudinary não definidas")
	}

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return "", err
	}

	resp, err := cld.Upload.Upload(context.Background(), filePath, uploader.UploadParams{
		Folder: "turma-do-copo/players",
	})
	if err != nil {
		return "", err
	}

	if resp.SecureURL == "" {
		return "", errors.New("cloudinary retornou URL vazia")
	}

	return resp.SecureURL, nil
}
