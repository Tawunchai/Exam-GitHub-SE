package entity

import (
	"time"

	"gorm.io/gorm"
)

type Work struct {
	gorm.Model
	Feed  bool 
	Cleaning  bool 
	FinishDate     time.Time 

	EmployeeID uint
	Employee   Employee `gorm:"foreignKey:EmployeeID"`

	HabitatID uint
	Habitat   Habitat `gorm:"foreignKey:HabitatID"`
}