package apperror

import (
	"net/http"
)

var (
	ErrInternalServerError = &AppError{
		Code:    http.StatusInternalServerError,
		Message: "internal server error",
	}
	ErrSqlError = &AppError{
		Code:    http.StatusInternalServerError,
		Message: "database server failed to execute query",
	}
	ErrTooManyRequest = &AppError{
		Code:    http.StatusTooManyRequests,
		Message: "too many request",
	}

	// menus error
	ErrMenuNotFound = &AppError{
		Code:    http.StatusNotFound,
		Message: "menu not found",
	}
	ErrMenuExists = &AppError{
		Code:    http.StatusConflict,
		Message: "menu already exists",
	}
)

func NewInternalServerError(err error) error {
	return &AppError{
		Code:    http.StatusInternalServerError,
		Message: "internal server error",
		Err:     err,
	}
}

func NewBadRequestError(message string) error {
	return &AppError{
		Code:    http.StatusBadRequest,
		Message: message,
	}
}
