package routes

import (
	"menu-tree-backend/internal/controllers"

	"github.com/gin-gonic/gin"
)

type MenuRoute struct {
	controller controllers.IControlleryRegistry
	group      *gin.RouterGroup
}

type IMenuRoute interface {
	Run()
}

func NewMenuRoute(controller controllers.IControlleryRegistry, group *gin.RouterGroup) IMenuRoute {
	return &MenuRoute{
		controller: controller,
		group:      group,
	}
}

func (m *MenuRoute) Run() {
	group := m.group.Group("/menu")
	group.GET("", m.controller.GetMenuController().GetAll)
	group.GET("/:id", m.controller.GetMenuController().GetByMenuID)
	group.POST("", m.controller.GetMenuController().Create)
	group.PUT("/:id", m.controller.GetMenuController().Update)
	group.DELETE("/:id", m.controller.GetMenuController().DeleteByID)

}
