package entity

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name  string
	Path  string
	Price  float64
	Piece	uint
	Barcode string

	ShelfZoneID   uint
	ShelfZone  ShelfZone `gorm:"foreignKey:ShelfZoneID"`

	ListReceiving []ListReceiving `gorm:"foreignKey:ProductID"`   //ส่ง ProductID ไปเป็นฟอเรนคีย์ที่ตาราง ListProductSale

	ListProductSale []ListProductSale `gorm:"foreignKey:ProductID"`

}
