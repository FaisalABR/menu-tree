package repositories

import (
	"gorm.io/gorm"
)

type Registry struct {
	db *gorm.DB
}

type IRepositoryRegistry interface {
	GetMenu() IMenuRepository
}

func NewRepositoryRegistry(db *gorm.DB) IRepositoryRegistry {
	return &Registry{
		db: db,
	}
}

func (r *Registry) GetMenu() IMenuRepository {
	return NewMenuRepository(r.db)
}
