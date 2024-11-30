package entity

import "gorm.io/gorm"

type TicketGeneration struct {
	gorm.Model
	Generation string

	Tickets []Ticket `gorm:"foreignKey:TicketGenerationID"`
}
