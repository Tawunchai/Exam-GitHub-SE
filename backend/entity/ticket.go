package entity

import (

	"gorm.io/gorm"
)

type Ticket struct {
	gorm.Model
	Description  string 
	Price float64

	// UserId ทำหน้าที่เป็น FK
	TicketGenerationID *uint
	Generation   *TicketGeneration `gorm:"foreignKey:TicketGenerationID"`

	TicketBookings []TicketBooking `gorm:"foreignKey:TicketID"`

	Zones []Zone `gorm:"many2many:zone_ticket;"`

}