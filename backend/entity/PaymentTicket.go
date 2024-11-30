package entity

import (
	"time"

	"gorm.io/gorm"
)

type PaymentTicket struct {
	gorm.Model
	Amount  float64 
	PaymentDate  time.Time
	Path string
	PaymentStatus string

	BookingID *uint
	Booking   Booking `gorm:"foreignKey:BookingID"`

}