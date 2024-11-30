package entity

import (
	"gorm.io/gorm"
)

type ListProductSale struct {
	gorm.Model
	Price  float64
	Piece	int32

	ProductID   uint
	Product  Product `gorm:"foreignKey:ProductID"`  //รับฟอเรนคีย์ที่ส่งมาจากตาราง Product

	PaymentProductID   uint
	PaymentProduct  PaymentProduct `gorm:"foreignKey:PaymentProductID"`  


}
