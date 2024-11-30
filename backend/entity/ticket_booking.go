package entity

import (
	"time"

	"gorm.io/gorm"
)

type TicketBooking struct {
	gorm.Model
	VisitDate        time.Time
	QuantityCustomer uint
	TotalPrice       float64
	Checking         bool
 
	TicketID *uint
	Ticket   Ticket `gorm:"foreignKey:TicketID"`

	BookingID *uint
	Booking   Booking `gorm:"foreignKey:BookingID"`

	Rents []Rent `gorm:"foreignKey:TicketBookingID"`
}
