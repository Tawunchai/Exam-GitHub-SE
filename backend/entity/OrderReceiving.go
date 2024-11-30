package entity

import (
	"time"
	"gorm.io/gorm"
)

type OrderReceiving struct {
	gorm.Model
	Receiving_date time.Time
	Total_price float64

	EmployeeID   uint
	Employee  Employee `gorm:"foreignKey:EmployeeID"`

	ListReceiving []ListReceiving `gorm:"foreignKey:OrderReceivingID"`

}
