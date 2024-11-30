package entity

import (
	"time"
	"gorm.io/gorm"
)

// Report represents a report generated about an animal
type Prescription struct {
	gorm.Model
	Frequency string
	Duration string
	StartDate time.Time
	EndDate time.Time
	PrescriptionGiveDate time.Time

	Medicalrecord []Medicalrecord `gorm:"foreignKey:PrescriptionID"`
	Note string
	MedicineID uint  
	Medicine      Medicine     `gorm:"foreignKey:MedicineID"`

	EmployeeID uint
	Employee Employee `gorm:"foreignKey:EmployeeID"`

}
