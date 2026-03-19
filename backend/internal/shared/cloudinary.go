package shared

import (
	"context"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadToCloudinary(filePath string) (string, error) {
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		return "", err
	}

	resp, err := cld.Upload.Upload(context.Background(), filePath, uploader.UploadParams{
		Folder: "turma-do-copo/players",
	})
	if err != nil {
		return "", err
	}

	return resp.SecureURL, nil
}
