package repositories

import (
	"context"
	"errors"
	"fmt"
	"menu-tree-backend/internal/common/apperror"
	"menu-tree-backend/internal/domain/dto"
	"menu-tree-backend/internal/domain/model"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MenuRepository struct {
	db *gorm.DB
}

type IMenuRepository interface {
	FindAll(context.Context) ([]model.Menu, error)
	FindByID(context.Context, string) (*model.Menu, error)
	Create(context.Context, *dto.CreateMenuRequest) (*model.Menu, error)
	Update(context.Context, *dto.UpdateMenuRequest, string) (*model.Menu, error)
	Delete(context.Context, string) error
	FindChildren(context.Context, string) ([]model.Menu, error)
}

func NewMenuRepository(db *gorm.DB) IMenuRepository {
	return &MenuRepository{
		db: db,
	}
}

func (r *MenuRepository) CountChildren(parentID *uuid.UUID) (int64, error) {

	var count int64

	if parentID == nil {
		err := r.db.Model(&model.Menu{}).
			Where("parent_id IS NULL").
			Count(&count).Error
		return count, err
	}

	err := r.db.Model(&model.Menu{}).
		Where("parent_id = ?", parentID).
		Count(&count).Error

	return count, err
}

func (r *MenuRepository) FindAll(ctx context.Context) ([]model.Menu, error) {
	var menus []model.Menu

	err := r.db.WithContext(ctx).Find(&menus).Error
	if err != nil {
		return nil, fmt.Errorf("retrive all menus: %w", apperror.NewInternalServerError(err))
	}

	return menus, nil
}

func (r *MenuRepository) FindByID(ctx context.Context, id string) (*model.Menu, error) {
	var menu model.Menu
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&menu).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("menu ID %s: %w", id, apperror.ErrMenuNotFound)
		}

		return nil, fmt.Errorf("finding menu by ID: %w", apperror.NewInternalServerError(err))
	}

	return &menu, nil

}

func (r *MenuRepository) Create(ctx context.Context, req *dto.CreateMenuRequest) (*model.Menu, error) {
	count, err := r.CountChildren(req.ParentID)

	if err != nil {
		return nil, apperror.NewInternalServerError(err)
	}

	menu := model.Menu{
		Name:     req.Name,
		ParentID: req.ParentID,
		Order:    int(count) + 1,
	}

	err = r.db.WithContext(ctx).Create(&menu).Error
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") ||
			strings.Contains(err.Error(), "unique constraint") {
			return nil, apperror.ErrMenuExists
		}

		return nil, fmt.Errorf("Error create menu: %w", apperror.NewInternalServerError(err))
	}

	return &menu, nil
}

func (r *MenuRepository) Update(ctx context.Context, req *dto.UpdateMenuRequest, id string) (*model.Menu, error) {
	menu, err := r.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.ParentID != nil {
		parsedUUID, err := uuid.Parse(*req.ParentID)
		if err != nil {
			return nil, apperror.NewInternalServerError(err)
		}
		menu.ParentID = &parsedUUID
	}

	if req.Order != nil {
		menu.Order = *req.Order
	}

	menu.Name = req.Name

	err = r.db.WithContext(ctx).Save(menu).Error
	if err != nil {
		if strings.Contains(err.Error(), "duplicate") ||
			strings.Contains(err.Error(), "unique constraint") {
			return nil, apperror.ErrMenuExists
		}
		return nil, fmt.Errorf("creating menu: %w", apperror.NewInternalServerError(err))
	}

	return menu, nil
}

func (r *MenuRepository) Delete(ctx context.Context, id string) error {
	err := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Menu{}).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return apperror.ErrMenuNotFound
		}

		return fmt.Errorf("Deleting menu: %w", apperror.NewInternalServerError(err))
	}

	return nil
}

func (r *MenuRepository) FindChildren(ctx context.Context, parentID string) ([]model.Menu, error) {
	var menus []model.Menu

	err := r.db.WithContext(ctx).
		Where("parent_id = ?", parentID).
		Order("\"order\" asc").
		Find(&menus).Error

	return menus, err
}
