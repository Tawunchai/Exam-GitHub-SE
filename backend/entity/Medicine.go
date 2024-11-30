package entity

import (
	"time"

	"gorm.io/gorm"
)

type Medicine struct {
	gorm.Model
	MedicineName string
	Dosage string
	Stock int
	ExpiryDate time.Time
	Price float64

	MedicineTypeID uint
	MedicineType MedicineType `gorm:"foreignKey:MedicineTypeID"`

}
