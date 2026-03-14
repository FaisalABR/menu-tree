package services

import (
	"menu-tree-backend/internal/repositories"
)

type ServiceRegistry struct {
	repository repositories.IRepositoryRegistry
}

type IServiceRegistry interface {
	GetMenu() IMenuService
}

func NewServiceRegistry(repository repositories.IRepositoryRegistry) IServiceRegistry {
	return &ServiceRegistry{
		repository: repository,
	}
}

func (s *ServiceRegistry) GetMenu() IMenuService {
	return NewMenuService(s.repository)
}
