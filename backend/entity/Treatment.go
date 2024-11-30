package entity

import "gorm.io/gorm"

type Treatment struct {
	gorm.Model
	TreatmentPlan string

	MedicalrecordID uint
	Medicalrecord Medicalrecord `gorm:"foreignkey:TreatmentID"`

}