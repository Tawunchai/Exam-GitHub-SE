package entity

import "gorm.io/gorm"

type MedicineType struct {
	gorm.Model
	MedicineType string

	Medicine []Medicine `gorm:"foreignKey:MedicineTypeID"`
}
 