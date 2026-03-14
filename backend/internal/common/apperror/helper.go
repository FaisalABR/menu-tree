package apperror

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-playground/validator/v10"
)

type ValidationResponse struct {
	Field   string `json:"field,omitempty"`
	Message string `json:"message,omitempty"`
}

var ErrValidator = map[string]string{}

func ErrValidationResponse(err error) (validationResponse []ValidationResponse) {
	var fieldErrors validator.ValidationErrors

	if errors.As(err, &fieldErrors) {
		for _, err := range fieldErrors {
			switch err.Tag() {
			case "required":
				validationResponse = append(validationResponse, ValidationResponse{
					Field:   err.Field(),
					Message: fmt.Sprintf("%s is required", err.Field()),
				})
			case "email":
				validationResponse = append(validationResponse, ValidationResponse{
					Field:   err.Field(),
					Message: fmt.Sprintf("%s is not a valid email address", err.Field()),
				})
			default:
				errValidator, ok := ErrValidator[err.Tag()]
				if ok {
					count := strings.Count(errValidator, "%s")

					if count == 1 {
						validationResponse = append(validationResponse, ValidationResponse{
							Field:   err.Field(),
							Message: fmt.Sprintf(errValidator, err.Field()),
						})
					} else {
						validationResponse = append(validationResponse, ValidationResponse{
							Field:   err.Field(),
							Message: fmt.Sprintf(errValidator, err.Field(), err.Param()),
						})
					}
				} else {
					validationResponse = append(validationResponse, ValidationResponse{
						Field:   err.Field(),
						Message: fmt.Sprintf("something wrong on %s; %s", err.Field(), err.Tag()),
					})
				}
			}

		}
	}

	return validationResponse
}

func GetHTTPCode(err error) int {
	if err == nil {
		return http.StatusOK
	}

	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.HTTPCode()
	}

	return http.StatusInternalServerError
}

func GetMessage(err error) string {
	if err == nil {
		return ""
	}

	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Message
	}

	return "internal server error"
}
