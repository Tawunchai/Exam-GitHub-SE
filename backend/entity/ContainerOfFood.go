package entity

import "gorm.io/gorm"

type ContainerOfFood struct {
	gorm.Model
	ContainerName string

	StockOfFood *StockOfFood `gorm:"foreignkey:ContainerOfFoodID"`
}
