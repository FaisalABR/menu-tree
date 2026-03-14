package dto

import "github.com/google/uuid"

type CreateMenuRequest struct {
	Name     string     `json:"name" binding:"required"`
	ParentID *uuid.UUID `json:"parent_id"`
}

type UpdateMenuRequest struct {
	Name     string  `json:"name" binding:"required"`
	Order    *int    `json:"order,omitempty"`
	ParentID *string `json:"parent_id,omitempty"`
}

type MenuResponse struct {
	ID       uuid.UUID      `json:"id"`
	Name     string         `json:"name"`
	ParentID *string        `json:"parent_id,omitempty"`
	Order    int            `json:"order"`
	Children []MenuResponse `json:"children,omitempty"`
}

type MenuDetailResponse struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	ParentID   *string `json:"parent_id"`
	ParentName *string `json:"parent_name,omitempty"`
	Depth      int     `json:"depth"`
	Order      int     `json:"order"`
}

type ReorderMenuRequest struct {
	NewOrder int `json:"new_order" binding:"required"`
}

type MoveMenuRequest struct {
	NewParentID *uuid.UUID `json:"new_parent_id"`
}
