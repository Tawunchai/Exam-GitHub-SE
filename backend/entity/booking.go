package entity

import (
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	gorm.Model
	BookingDate  time.Time 
	AllPrice  float64 

	// UserId ทำหน้าที่เป็น FK
	UserID *uint
	User   *User `gorm:"foreignKey:UserID"`

	TicketBookings []TicketBooking `gorm:"foreignKey:BookingID"`

	PaymentTickets []PaymentTicket `gorm:"foreignKey:BookingID"`
	
}