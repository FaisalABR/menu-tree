package response

import (
	"menu-tree-backend/internal/common/apperror"
	"menu-tree-backend/internal/constants"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func Success(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, Response{
		Status:  constants.Success,
		Message: message,
		Data:    data,
	})
}

func Error(c *gin.Context, err error) {
	code := apperror.GetHTTPCode(err)
	message := apperror.GetMessage(err)

	c.JSON(code, Response{
		Status:  constants.Error,
		Message: message,
		Data:    nil,
	})
}

func ValidationError(c *gin.Context, validationErrors interface{}) {
	c.JSON(http.StatusBadRequest, Response{
		Status:  constants.Error,
		Message: "validation errors",
		Data:    validationErrors,
	})
}
