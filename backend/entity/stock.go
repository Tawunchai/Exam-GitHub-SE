package entity

import (
	"gorm.io/gorm"
)

type Stocks struct {
    gorm.Model
    Name       string
    Quantity      uint

}