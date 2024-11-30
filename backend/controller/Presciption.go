package controller

import (
	"net/http"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"

	"github.com/gin-gonic/gin"
)

func GetAllPresciption(c *gin.Context) {
	db := config.DB()

	var prescription []entity.Prescription
	if err := db.
		Preload("Employee").
		Preload("Medicine").
		Preload("MedicineType").
		Find(&prescription).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, prescription)
}

func CreatePrescription(c *gin.Context) {
	db := config.DB()

	// รับข้อมูล JSON และแปลงเป็นโครงสร้าง Animal
	var newPrescription entity.Prescription
	if err := c.ShouldBindJSON(&newPrescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูล Animal ลงในฐานข้อมูล
	if err := db.Create(&newPrescription).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่สร้างใหม่กลับไปในรูปแบบ JSON
	c.JSON(http.StatusCreated, newPrescription)
}

func UpdatePrescription(c *gin.Context) {
	db := config.DB()

	// Get the animal ID from the URL parameter
	prescriptionID := c.Param("id")

	var prescription entity.Prescription
	// Find the animal by its ID
	if err := db.First(&prescription, prescriptionID).Error; err != nil {
		// If the animal is not found, return a 404 error
		c.JSON(http.StatusNotFound, gin.H{"error": "Animal not found"})
		return
	}

	// Bind the incoming JSON to the existing animal struct
	if err := c.ShouldBindJSON(&prescription); err != nil {
		// If there is an error binding the JSON, return a 400 error
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated animal data in the database
	if err := db.Save(&prescription).Error; err != nil {
		// If there is an error saving the data, return a 500 error
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the updated animal data
	c.JSON(http.StatusOK, prescription)
}

func DeletePrescriptionByID(c *gin.Context) {
	db := config.DB()

	// ดึง ID ของ Medicine จาก request
	PrescriptionID := c.Param("id")

	var Prescription entity.Prescription

	// ค้นหายาที่มี MedicineID ตรงกับที่ส่งมา
	if err := db.First(&Prescription, PrescriptionID).Error; err != nil {
		// ถ้าไม่พบยา ให้ส่งกลับ 404
		c.JSON(http.StatusNotFound, gin.H{"error": "Prescription not found"})
		return
	}

	// ลบยาจากฐานข้อมูล
	if err := db.Delete(&Prescription).Error; err != nil {
		// ถ้าเกิดข้อผิดพลาดในการลบ ให้ส่งกลับ 500
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Prescription"})
		return
	}

	// ถ้าลบสำเร็จ ให้ส่งข้อความตอบกลับ
	c.JSON(http.StatusOK, gin.H{"message": "Prescription deleted successfully"})
}

func GetPrescriptionByID(c *gin.Context) {
	db := config.DB()

	presciptionID := c.Param("id")

	var presciption entity.Prescription

	if err := db.First(&presciption, presciptionID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, presciption)
}

