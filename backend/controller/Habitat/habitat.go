package habitat

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
	"github.com/gin-gonic/gin"
)

func ListHabitat(c *gin.Context) {
	var habitats []entity.Habitat

	db := config.DB()
	results := db.Preload("Zone").Preload("Animals").Find(&habitats)
	if results.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
		return
	}

	if results.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No habitats found"})
		return
	}

	c.JSON(http.StatusOK, habitats)
}


func CreateHabitat(c *gin.Context) {
	var habitat entity.Habitat
	db := config.DB()

	// รับรูปภาพจากฟอร์ม
	image, err := c.FormFile("picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Error receiving image: %v", err)})
		return
	}

	// สร้างโฟลเดอร์สำหรับเก็บรูปภาพ (ถ้ายังไม่มี)
	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create upload directory: %v", err)})
		return
	}

	// บันทึกไฟล์รูปภาพ
	filePath := filepath.Join(uploadDir, image.Filename)
	if err := c.SaveUploadedFile(image, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to save image: %v", err)})
		return
	}

	// รับข้อมูลจากฟอร์ม
	habitat.Name = c.PostForm("name")

	// แปลงข้อมูลที่รับมาจากฟอร์มเป็นประเภทที่เหมาะสม
	sizeStr := c.PostForm("size")
	size, err := strconv.ParseFloat(sizeStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid size format: %v", err)})
		return
	}
	habitat.Size = size

	capacityStr := c.PostForm("capacity")
	capacity, err := strconv.ParseUint(capacityStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid capacity format: %v", err)})
		return
	}
	habitat.Capacity = uint(capacity)

	// รับข้อมูล ZoneID
	zoneIDStr := c.PostForm("zoneID")
	zoneID, err := strconv.ParseUint(zoneIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid zone ID format: %v", err)})
		return
	}
	habitat.ZoneID = uint(zoneID)

	// บันทึก Path รูปภาพ
	habitat.Picture = filePath

	// บันทึกข้อมูล Habitat ลงในฐานข้อมูล
	if err := db.Create(&habitat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create habitat: %v", err)})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Habitat created successfully",
		"data":    habitat,
	})
}

func DeleteHabitat(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var habitat entity.Habitat

	if err := db.Where("id = ?", id).First(&habitat).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Animal not found"})
		return
	}

	if err := db.Delete(&habitat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete animal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Habitat deleted successfully"})
}

func UpdateHabitat(c *gin.Context) {
	var habitat entity.Habitat
	db := config.DB()

	// รับค่า ID ของ Habitat จาก URL
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing habitat ID"})
		return
	}

	// ค้นหา Habitat ตาม ID
	if err := db.Where("id = ?", id).First(&habitat).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Habitat not found"})
		return
	}

	// ตรวจสอบและจัดการการส่งค่าฟอร์ม
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	// อัปเดตฟิลด์ต่างๆ ของ Habitat
	if name := c.PostForm("Name"); name != "" {
		habitat.Name = name
	}

	if size := c.PostForm("Size"); size != "" {
		if s, err := strconv.ParseFloat(size, 64); err == nil {
			habitat.Size = s
		}
	}

	if capacity := c.PostForm("Capacity"); capacity != "" {
		if c, err := strconv.ParseUint(capacity, 10, 32); err == nil {
			habitat.Capacity = uint(c)
		}
	}

	// อัปเดต ZoneID ถ้ามี
	if zoneID := c.PostForm("ZoneID"); zoneID != "" {
		if zID, err := strconv.ParseUint(zoneID, 10, 32); err == nil {
			habitat.ZoneID = uint(zID)
		}
	}

	// อัปเดตรูปภาพ (ถ้ามี)
	file, err := c.FormFile("Picture")
	if err == nil && file != nil {
		uploadDir := "uploads"
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
			return
		}

		filePath := filepath.Join(uploadDir, file.Filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		habitat.Picture = filePath
	}

	// บันทึกการเปลี่ยนแปลงในฐานข้อมูล
	if err := db.Save(&habitat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to update habitat: %v", err)})
		return
	}

	// ส่งข้อความตอบกลับหลังจากอัปเดตสำเร็จ
	c.JSON(http.StatusOK, gin.H{"message": "Habitat updated successfully", "data": habitat})
}

func GetHabitatById(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var habitat entity.Habitat

	if err := db.Preload("Zone").Preload("Animals").Preload("Work").Where("id = ?", id).First(&habitat).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Habitat not found"})
		return
	}

	c.JSON(http.StatusOK, habitat)
}