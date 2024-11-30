package entity

import (
	"time"

	"gorm.io/gorm"
)

type Vehicle struct {
	gorm.Model
	Name string 
	ReceivedDate time.Time 
	AvaliabilityStatus string
	Price float64 
	Picture string  
	QuantityVehicle uint 

	VehicleTypeID uint
	VehicleType   VehicleType `gorm:"foreignKey:VehicleTypeID"`

	EmployeeID uint
	Employee   Employee `gorm:"foreignKey:EmployeeID"`

	Rents []Rent `gorm:"many2many:rent_vehicle;"`

}