package entity

import (
	"time"
	"gorm.io/gorm"
)

type Calendar struct {
	gorm.Model
	Title     string
	StartDate time.Time
	AllDay    bool

	EmployeeID *uint
	Employee   Employee `gorm:"foreignKey:EmployeeID"`
}
