package controller

import (
	"net/http"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
	"github.com/gin-gonic/gin"
)

func GetAllMedicine(c *gin.Context) {
	db := config.DB()

	var Medicine []entity.Medicine
	if err := db.
		Preload("MedicineType").
		Find(&Medicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, Medicine)
}

func CreateMedicine(c *gin.Context) {
	db := config.DB()

	// รับข้อมูล JSON และแปลงเป็นโครงสร้าง Animal
	var newMedicine entity.Medicine
	if err := c.ShouldBindJSON(&newMedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกข้อมูล Animal ลงในฐานข้อมูล
	if err := db.Create(&newMedicine).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ส่งข้อมูลที่สร้างใหม่กลับไปในรูปแบบ JSON
	c.JSON(http.StatusCreated, newMedicine)
}

func UpdateMedicineByID(c *gin.Context) {
	db := config.DB()

	// Get the animal ID from the URL parameter
	MedicineID := c.Param("id")

	var Medicine entity.Medicine
	// Find the animal by its ID
	if err := db.First(&Medicine, MedicineID).Error; err != nil {
		// If the animal is not found, return a 404 error
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// Bind the incoming JSON to the existing animal struct
	if err := c.ShouldBindJSON(&Medicine); err != nil {
		// If there is an error binding the JSON, return a 400 error
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated animal data in the database
	if err := db.Save(&Medicine).Error; err != nil {
		// If there is an error saving the data, return a 500 error
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return the updated animal data
	c.JSON(http.StatusOK, Medicine)
}

func DeleteMedicineByID(c *gin.Context) {
	db := config.DB()

	// ดึง ID ของ Medicine จาก request
	MedicineID := c.Param("id")

	var Medicine entity.Medicine

	// ค้นหายาที่มี MedicineID ตรงกับที่ส่งมา
	if err := db.First(&Medicine, MedicineID).Error; err != nil {
		// ถ้าไม่พบยา ให้ส่งกลับ 404
		c.JSON(http.StatusNotFound, gin.H{"error": "Medicine not found"})
		return
	}

	// ลบยาจากฐานข้อมูล
	if err := db.Delete(&Medicine).Error; err != nil {
		// ถ้าเกิดข้อผิดพลาดในการลบ ให้ส่งกลับ 500
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Medicine"})
		return
	}

	// ถ้าลบสำเร็จ ให้ส่งข้อความตอบกลับ
	c.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

func GetMedicineByID(c *gin.Context) {
	db := config.DB()

	medicineID := c.Param("id")

	var medicine entity.Medicine

	if err := db.First(&medicine, medicineID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, medicine)
}