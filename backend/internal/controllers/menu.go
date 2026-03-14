package controllers

import (
	"menu-tree-backend/internal/common/apperror"
	"menu-tree-backend/internal/common/response"
	"menu-tree-backend/internal/domain/dto"
	"menu-tree-backend/internal/services"

	"github.com/gin-gonic/gin"
)

type MenuController struct {
	services services.IServiceRegistry
}

type IMenuController interface {
	GetAll(*gin.Context)
	Create(*gin.Context)
	GetByMenuID(*gin.Context)
	Update(*gin.Context)
	DeleteByID(*gin.Context)
}

func NewMenuController(services services.IServiceRegistry) IMenuController {
	return &MenuController{
		services: services,
	}
}

// GetAll godoc
// @Summary Get all menus
// @Description Retrieve a list of all menus in a tree structure
// @Tags Menu
// @Produce json
// @Success 200 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /menu [get]
func (mc *MenuController) GetAll(c *gin.Context) {
	menus, err := mc.services.GetMenu().GetAll(c)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, menus, "Succesfully retrieve menus data")
}

// Create godoc
// @Summary Create a new menu
// @Description Create a new menu item
// @Tags Menu
// @Accept json
// @Produce json
// @Param request body dto.CreateMenuRequest true "Menu details"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /menu [post]
func (mc *MenuController) Create(c *gin.Context) {
	var req *dto.CreateMenuRequest

	err := c.ShouldBindJSON(&req)
	if err != nil {
		errResponse := apperror.ErrValidationResponse(err)
		response.ValidationError(c, errResponse)
		return
	}

	menus, err := mc.services.GetMenu().Create(c, req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, menus, "Succesfully create menu data")
}

// GetByMenuID godoc
// @Summary Get a menu by ID
// @Description Retrieve details of a specific menu and its children by ID
// @Tags Menu
// @Produce json
// @Param id path string true "Menu ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Router /menu/{id} [get]
func (mc *MenuController) GetByMenuID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, apperror.NewBadRequestError("ID is required"))
		return
	}
	menus, err := mc.services.GetMenu().GetByID(c, id)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, menus, "Succesfully retrieve menu data")
}

// Update godoc
// @Summary Update a menu
// @Description Update the details (name, order, parent) of an existing menu
// @Tags Menu
// @Accept json
// @Produce json
// @Param id path string true "Menu ID"
// @Param request body dto.UpdateMenuRequest true "Updated menu details"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /menu/{id} [put]
func (mc *MenuController) Update(c *gin.Context) {
	var req *dto.UpdateMenuRequest

	id := c.Param("id")
	if id == "" {
		response.Error(c, apperror.NewBadRequestError("ID is required"))
		return
	}

	err := c.ShouldBindJSON(&req)
	if err != nil {
		errResponse := apperror.ErrValidationResponse(err)
		response.ValidationError(c, errResponse)
		return
	}

	menus, err := mc.services.GetMenu().Update(c, req, id)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, menus, "Succesfully update menu data")
}

// DeleteByID godoc
// @Summary Delete a menu
// @Description Delete an existing menu item by ID
// @Tags Menu
// @Produce json
// @Param id path string true "Menu ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /menu/{id} [delete]
func (mc *MenuController) DeleteByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.Error(c, apperror.NewBadRequestError("ID is required"))
		return
	}

	err := mc.services.GetMenu().Delete(c, id)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, nil, "Succesfully delete menu data")
}
