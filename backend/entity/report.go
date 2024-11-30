package entity

import (
	"time"

	"gorm.io/gorm"
)

type Report struct {
	gorm.Model
	Title  string 
	Description  string 
	ReportDate     time.Time
	Status string
	StatusVet string
	Picture string

	AnimalID uint
	Animal   Animal `gorm:"foreignKey:AnimalID"`

	EmployeeID uint
	Employee   Employee `gorm:"foreignKey:EmployeeID"`

	Medicalrecord  *Medicalrecord  `gorm:"foreignKey:ReportID"`
}