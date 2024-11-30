package entity

import "gorm.io/gorm"

type Zone struct {
	gorm.Model
	Zone string
	Description string
	Picture string

	Tickets []Ticket `gorm:"many2many:zone_ticket;"`

	Habitats []Habitat `gorm:"foreignKey:ZoneID"`

	Event []Event `gorm:"foreignKey:ZoneID"`
}
