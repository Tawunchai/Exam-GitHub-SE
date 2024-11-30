package entity

import (
	"gorm.io/gorm"
	"time"
)

type PaymentProduct struct {
	gorm.Model
	Date  time.Time
	TypePayment string
	TotalAmount float32

	EmployeeID   uint
	Employee  Employee `gorm:"foreignKey:EmployeeID"` 

	// PromotionID   uint
	// Promotion  Promotion `gorm:"foreignKey:PromotionID"` 

	ListProductSale []ListProductSale `gorm:"foreignKey:PaymentProductID"`
}
