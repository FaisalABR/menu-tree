package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Menu struct {
	ID        uuid.UUID `gorm:"primaryKey"`
	Name      string
	ParentID  *uuid.UUID
	Order     int
	CreatedAt *time.Time
	UpdatedAt *time.Time
}

func (m *Menu) BeforeCreate(tx *gorm.DB) (err error) {
	m.ID = uuid.New()
	return
}
