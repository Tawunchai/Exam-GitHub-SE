package entity

import (
	"gorm.io/gorm"
)

type ShelfZone struct {
	gorm.Model
	Zonename  string
	Location string

	Product []Product `gorm:"foreignKey:ShelfZoneID"`
}
