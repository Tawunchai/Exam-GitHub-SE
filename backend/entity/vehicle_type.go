package entity

import (
	
	"gorm.io/gorm"
)

type VehicleType struct {
	gorm.Model
	VehicleType string
	
	// 1 Role มีได้หลาย User
	Vehicles []Vehicle `gorm:"foreignKey:VehicleTypeID"`
}