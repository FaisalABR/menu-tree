package controllers

import "menu-tree-backend/internal/services"

type ControllerRegistry struct {
	service services.IServiceRegistry
}

type IControlleryRegistry interface {
	GetMenuController() IMenuController
}

func NewControllerRegistry(service services.IServiceRegistry) IControlleryRegistry {
	return &ControllerRegistry{
		service: service,
	}
}

func (c *ControllerRegistry) GetMenuController() IMenuController {
	return NewMenuController(c.service)
}
