package entity

import (
	"time"

	"gorm.io/gorm"
)


type Medicalrecord struct {
	gorm.Model
	DiagnosisDate time.Time
	Diagnosis string
	Symptoms string
	RecordDate time.Time
	RecordStatus bool
	TotalCost float64

	EmployeeID *uint
	Employee   *Employee `gorm:"foreignKey:EmployeeID"`

	ReportID *uint
	Report   *Report `gorm:"foreignKey:ReportID"`

	TreatmentID *uint
	Treatment   *Treatment `gorm:"foreignKey:TreatmentID"`

	PrescriptionID uint
	Prescription Prescription `gorm:"foreignKey:PrescriptionID"`
}