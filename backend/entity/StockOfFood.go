package entity

import (
	"time"

	"gorm.io/gorm"
)

type StockOfFood struct {
	gorm.Model
	Foodname string
	Quantity int
	ExpiryDate time.Time
	LastRestockDate time.Time

	ContainerOfFoodID *uint
	ContainerOfFood *ContainerOfFood `gorm:"foreignkey:ContainerOfFoodID"`

	CatagoryOfFoodID uint
	CatagoryOfFood CatagoryOfFood `gorm:"foreignkey:CatagoryOfFoodID"`

	EmployeeID uint 
	Employee Employee `gorm:"foreignkey:EmployeeID"`
}
