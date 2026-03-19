package shared

import (
	"context"
	"errors"
	"fmt"
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
		return "", fmt.Errorf("erro ao criar cliente cloudinary: %w", err)
	}

	resp, err := cld.Upload.Upload(context.Background(), filePath, uploader.UploadParams{
		Folder:       "turma-do-copo/players",
		ResourceType: "image",
	})
	if err != nil {
		return "", fmt.Errorf("erro no upload cloudinary: %w", err)
	}

	fmt.Println("=== CLOUDINARY RESPONSE ===")
	fmt.Println("SecureURL:", resp.SecureURL)
	fmt.Println("URL:", resp.URL)
	fmt.Println("PublicID:", resp.PublicID)

	// prioridade 1: URL segura
	if resp.SecureURL != "" {
		return resp.SecureURL, nil
	}

	// fallback: URL normal
	if resp.URL != "" {
		return resp.URL, nil
	}

	return "", errors.New("cloudinary retornou URL vazia")
}
