package entity

import (
	"gorm.io/gorm"
)

type ListReceiving struct {
	gorm.Model
	Quantity uint

	ProductID   uint   //ชื่อคอลั่มที่ตารางนี้
	Product  Product `gorm:"foreignKey:ProductID"` //รับฟอเรนคีย์จากตาราง...

	OrderReceivingID uint
	OrderReceiving	OrderReceiving  `gorm:"foreignKey:OrderReceivingID"`

}
