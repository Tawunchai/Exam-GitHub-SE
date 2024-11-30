package entity

import (
	"time"

	"gorm.io/gorm"
)

type Rent struct {
	gorm.Model
	Quantity  	uint 
	RentDate  	time.Time 
	StartTime   time.Time  
	EndTime 	time.Time 
	TotalPrice 	float64

	// UserId ทำหน้าที่เป็น FK
	TicketBookingID *uint
	TicketBooking   *TicketBooking `gorm:"foreignKey:TicketBookingID"`

	Vehicle []Vehicle `gorm:"many2many:rent_vehicle;"`
}