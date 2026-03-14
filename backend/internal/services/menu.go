package services

import (
	"context"
	"menu-tree-backend/internal/common/utils"
	"menu-tree-backend/internal/domain/dto"
	"menu-tree-backend/internal/domain/model"
	"menu-tree-backend/internal/repositories"

	"github.com/google/uuid"
)

type MenuService struct {
	repository repositories.IRepositoryRegistry
}

type IMenuService interface {
	GetAll(context.Context) ([]dto.MenuResponse, error)
	GetByID(context.Context, string) (*dto.MenuResponse, error)
	Create(context.Context, *dto.CreateMenuRequest) (*dto.MenuResponse, error)
	Update(context.Context, *dto.UpdateMenuRequest, string) (*dto.MenuResponse, error)
	Delete(context.Context, string) error
}

func NewMenuService(repository repositories.IRepositoryRegistry) IMenuService {
	return &MenuService{
		repository: repository,
	}
}

func buildTree(menus []model.Menu, parentID *uuid.UUID) []dto.MenuResponse {

	var tree []dto.MenuResponse

	for _, m := range menus {

		if (parentID == nil && m.ParentID == nil) ||
			(parentID != nil && m.ParentID != nil && *m.ParentID == *parentID) {

			node := dto.MenuResponse{
				ID:    m.ID,
				Name:  m.Name,
				Order: m.Order,
			}

			node.Children = buildTree(menus, &m.ID)

			tree = append(tree, node)
		}
	}

	return tree
}

func (m *MenuService) GetAll(ctx context.Context) ([]dto.MenuResponse, error) {

	menus, err := m.repository.GetMenu().FindAll(ctx)
	if err != nil {
		return nil, err
	}

	tree := buildTree(menus, nil)

	return tree, nil
}

func (m *MenuService) GetByID(ctx context.Context, id string) (*dto.MenuResponse, error) {
	menu, err := m.repository.GetMenu().FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	res := utils.ToMenuResponse(menu)

	children, err := m.repository.GetMenu().FindChildren(ctx, id)
	if err != nil {
		return nil, err
	}

	for _, child := range children {
		childDTO := utils.ToMenuResponse(&child)
		res.Children = append(res.Children, childDTO)
	}

	return &res, nil
}

func (m *MenuService) Create(ctx context.Context, req *dto.CreateMenuRequest) (*dto.MenuResponse, error) {
	menu, err := m.repository.GetMenu().Create(ctx, req)
	if err != nil {
		return nil, err
	}

	dtoMenu := &dto.MenuResponse{
		ID:    menu.ID,
		Name:  menu.Name,
		Order: menu.Order,
	}

	return dtoMenu, nil
}

func (m *MenuService) Update(ctx context.Context, req *dto.UpdateMenuRequest, id string) (*dto.MenuResponse, error) {
	var parentID *string

	menu, err := m.repository.GetMenu().Update(ctx, req, id)
	if err != nil {
		return nil, err
	}

	if menu.ParentID != nil {
		id := menu.ParentID.String()
		parentID = &id
	}

	response := &dto.MenuResponse{
		ID:       menu.ID,
		Name:     menu.Name,
		ParentID: parentID,
	}

	return response, nil
}

func (m *MenuService) Delete(ctx context.Context, id string) error {
	err := m.repository.GetMenu().Delete(ctx, id)
	if err != nil {
		return err
	}

	return nil
}
