package entity

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Title  string 
	Description  string 
	StartDate     time.Time 
	EndDate time.Time
	Picture string

	ZoneID uint
	Zone   Zone `gorm:"foreignKey:ZoneID"`

	AnimalID uint
	Animal   Animal `gorm:"foreignKey:AnimalID"`

	EmployeeID uint
	Employee   Employee `gorm:"foreignKey:EmployeeID"`
}