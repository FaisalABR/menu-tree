package routes

import (
	"menu-tree-backend/internal/controllers"

	"github.com/gin-gonic/gin"
)

type RouteRegistry struct {
	controller controllers.IControlleryRegistry
	group      *gin.RouterGroup
}

type IRouteRegistry interface {
	Serve()
}

func NewRouteRegistry(controller controllers.IControlleryRegistry, group *gin.RouterGroup) IRouteRegistry {
	return &RouteRegistry{
		controller: controller,
		group:      group,
	}
}

func (r *RouteRegistry) menuRoute() IMenuRoute {
	return NewMenuRoute(r.controller, r.group)
}

func (r *RouteRegistry) Serve() {
	r.menuRoute().Run()
}
