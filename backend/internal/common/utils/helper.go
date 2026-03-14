package utils

import (
	"menu-tree-backend/internal/domain/dto"
	"menu-tree-backend/internal/domain/model"
)

func ToMenuResponse(menu *model.Menu) dto.MenuResponse {
	var parentID *string

	if menu.ParentID != nil {
		id := menu.ParentID.String()
		parentID = &id
	}

	return dto.MenuResponse{
		ID:       menu.ID,
		Name:     menu.Name,
		ParentID: parentID,
		Order:    menu.Order,
	}
}
