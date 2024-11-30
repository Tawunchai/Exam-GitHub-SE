package controller

import (
	"net/http"
	"time"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"

	"github.com/gin-gonic/gin"
)

func GetAllMedicalRcord(c *gin.Context) {
	db := config.DB()

	var medicalrecord []entity.Medicalrecord
	if err := db.
		Preload("Employee").
		Preload("Animal").
		Preload("Report").
		Find(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, medicalrecord)
}

func CreateMedicalRecord(c *gin.Context) {
	db := config.DB()

	// รับข้อมูล JSON และแปลงเป็นโครงสร้าง Animal
	var newMedicalrecord entity.Medicalrecord
	if err := c.ShouldBindJSON(&newMedicalrecord); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูล Animal ลงในฐานข้อมูล
	if err := db.Create(&newMedicalrecord).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่สร้างใหม่กลับไปในรูปแบบ JSON
	c.JSON(http.StatusCreated, newMedicalrecord)
}

func UpdateMedicalRecord(c *gin.Context) {
	db := config.DB()

	// Get the animal ID from the URL parameter
	medicalrecordID := c.Param("id")

	var medicalrecord entity.Medicalrecord
	// Find the animal by its ID
	if err := db.First(&medicalrecord, medicalrecordID).Error; err != nil {
		// If the animal is not found, return a 404 error
		c.JSON(http.StatusNotFound, gin.H{"error": "MedicalRecord not found"})
		return
	}

	// Bind the incoming JSON to the existing animal struct
	if err := c.ShouldBindJSON(&medicalrecord); err != nil {
		// If there is an error binding the JSON, return a 400 error
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated animal data in the database
	if err := db.Save(&medicalrecord).Error; err != nil {
		// If there is an error saving the data, return a 500 error
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the updated animal data
	c.JSON(http.StatusOK, medicalrecord)
}

func DeleteMedicalRecordByID(c *gin.Context) {
	db := config.DB()

	// ดึง ID ของ Medicine จาก request
	medicalrecordID := c.Param("id")

	var medicalrecord entity.Medicalrecord

	// ค้นหายาที่มี MedicineID ตรงกับที่ส่งมา
	if err := db.First(&medicalrecord, medicalrecordID).Error; err != nil {
		// ถ้าไม่พบยา ให้ส่งกลับ 404
		c.JSON(http.StatusNotFound, gin.H{"error": "MedicalRecord not found"})
		return
	}

	// ลบยาจากฐานข้อมูล
	if err := db.Delete(&medicalrecord).Error; err != nil {
		// ถ้าเกิดข้อผิดพลาดในการลบ ให้ส่งกลับ 500
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete MedicalRecord"})
		return
	}

	// ถ้าลบสำเร็จ ให้ส่งข้อความตอบกลับ
	c.JSON(http.StatusOK, gin.H{"message": "MedicalRecord deleted successfully"})
}

func GetMedicalRecordByID(c *gin.Context) {
	db := config.DB()

	medicalrecordID := c.Param("id")

	var medicalrecord entity.Medicalrecord

	if err := db.First(&medicalrecord, medicalrecordID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, medicalrecord)
}

func CreateTreatmentandMedicalRecord(c *gin.Context) {
	db := config.DB()

	// รับข้อมูลจาก JSON สำหรับ Treatment และ Medicalrecord
	var request struct {
		TreatmentPlan string               `json:"TreatmentPlan"`
		Medicalrecord entity.Medicalrecord `json:"Medicalrecord"`
	}

	// รับข้อมูล JSON จากผู้ใช้
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้าง Medicalrecord ก่อน
	newMedicalrecord := request.Medicalrecord
	if err := db.Create(&newMedicalrecord).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// สร้าง Treatment โดยที่เชื่อมโยงกับ Medicalrecord
	newTreatment := entity.Treatment{
		TreatmentPlan:   request.TreatmentPlan,
		MedicalrecordID: newMedicalrecord.ID, // เชื่อมโยงกับ Medicalrecord
	}

	// บันทึกข้อมูล Treatment
	if err := db.Create(&newTreatment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// บันทึก TreatmentID กลับไปยัง Medicalrecord หลังจากบันทึก Treatment เสร็จ
	newMedicalrecord.TreatmentID = &newTreatment.ID // ใช้ pointer เพื่อเก็บค่า TreatmentID
	if err := db.Save(&newMedicalrecord).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Medicalrecord with TreatmentID"})
		return
	}

	// ส่งข้อมูลที่สร้างใหม่กลับไป
	c.JSON(http.StatusCreated, gin.H{
		"Treatment":     newTreatment,
		"Medicalrecord": newMedicalrecord,
	})
}

func UpdateTreatmentAndMedicalRecord(c *gin.Context) {

	db := config.DB()
	medicalrecordID := c.Param("id") // รับค่า MedicalrecordID จาก URL parameter

	// รับข้อมูลที่ต้องการอัพเดต
	var request struct {
		TreatmentPlan  string  `json:"TreatmentPlan"`
		DiagnosisDate  string  `json:"DiagnosisDate"`
		Diagnosis      string  `json:"Diagnosis"`
		Symptoms       string  `json:"Symptoms"`
		RecordDate     string  `json:"RecordDate"`
		RecordStatus   bool    `json:"RecordStatus"`
		TotalCost      float64 `json:"TotalCost"`
		EmployeeID     uint    `json:"EmployeeID"`
		ReportID       uint    `json:"ReportID"`
		PrescriptionID uint    `json:"PrescriptionID"`
	}

	// รับข้อมูลจาก JSON
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// หา Treatment และ Medicalrecord ที่มี MedicalrecordID ตรงกับที่เราต้องการ
	var treatment entity.Treatment
	if err := db.Where("medicalrecord_id = ?", medicalrecordID).First(&treatment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Treatment not found"})
		return
	}

	var medicalrecord entity.Medicalrecord
	if err := db.Where("id = ?", medicalrecordID).First(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicalrecord not found"})
		return
	}

	// อัพเดตข้อมูล Treatment ถ้ามีข้อมูลใน request
	if request.TreatmentPlan != "" {
		treatment.TreatmentPlan = request.TreatmentPlan
		if err := db.Save(&treatment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Treatment"})
			return
		}
	}

	// แปลง DiagnosisDate และ RecordDate จาก string เป็น time.Time
	if request.DiagnosisDate != "" {
		parsedDiagnosisDate, err := time.Parse(time.RFC3339, request.DiagnosisDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DiagnosisDate format"})
			return
		}
		medicalrecord.DiagnosisDate = parsedDiagnosisDate
	}
	if request.RecordDate != "" {
		parsedRecordDate, err := time.Parse(time.RFC3339, request.RecordDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid RecordDate format"})
			return
		}
		medicalrecord.RecordDate = parsedRecordDate
	}

	// อัพเดตข้อมูล Medicalrecord
	if request.Diagnosis != "" {
		medicalrecord.Diagnosis = request.Diagnosis
	}
	if request.Symptoms != "" {
		medicalrecord.Symptoms = request.Symptoms
	}
	if request.RecordStatus {
		medicalrecord.RecordStatus = request.RecordStatus
	}
	if request.TotalCost > 0 {
		medicalrecord.TotalCost = request.TotalCost
	}

	// ใช้ pointer สำหรับ EmployeeID และ ReportID ถ้ามีการส่งมา
	if request.EmployeeID > 0 {
		medicalrecord.EmployeeID = &request.EmployeeID // ใช้ pointer
	}
	if request.ReportID > 0 {
		medicalrecord.ReportID = &request.ReportID // ใช้ pointer
	}
	if request.PrescriptionID > 0 {
		medicalrecord.PrescriptionID = request.PrescriptionID
	}

	// อัพเดตข้อมูล Medicalrecord
	if err := db.Save(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Medicalrecord"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Treatment and/or Medicalrecord updated successfully",
		"Treatment":     treatment,
		"Medicalrecord": medicalrecord,
	})

}

func DeleteTreatmentAndMedicalRecord(c *gin.Context) {
	db := config.DB()
	medicalRecordID := c.Param("id") // ใช้ Param เพื่อดึงค่า medicalrecordID

	// ค้นหา Treatment ที่มี MedicalrecordID ตรงกัน
	var treatment entity.Treatment
	if err := db.Where("medicalrecord_id = ?", medicalRecordID).First(&treatment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Treatment not found"})
		return
	}

	// กรณีลบแค่ Treatment เท่านั้น
	if c.DefaultQuery("deleteMedicalrecord", "false") == "false" {
		if err := db.Delete(&treatment).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Treatment"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Treatment deleted successfully"})
		return
	}

	// หาก deleteMedicalrecord = true จะลบทั้ง Treatment และ Medicalrecord
	var medicalrecord entity.Medicalrecord
	if err := db.Where("id = ?", treatment.MedicalrecordID).First(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicalrecord not found"})
		return
	}

	if err := db.Delete(&treatment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Treatment"})
		return
	}

	if err := db.Delete(&medicalrecord).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Medicalrecord"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Treatment and Medicalrecord deleted successfully"})

}
