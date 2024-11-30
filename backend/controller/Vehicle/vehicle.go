package vehicle

import (
	"github.com/Tawunchai/Zootopia/entity"
	"github.com/Tawunchai/Zootopia/config"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateVehicle(c *gin.Context) {
	var vehicle entity.Vehicle
	db := config.DB()

	// รับรูปภาพ
	image, err := c.FormFile("picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Error receiving image: %v", err)})
		return
	}

	// สร้างโฟลเดอร์ uploads
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
	vehicle.Name = c.PostForm("name")

	priceStr := c.PostForm("price")
	price, err := strconv.ParseFloat(priceStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid price format: %v", err)})
		return
	}
	vehicle.Price = price

	quantityVehicleStr := c.PostForm("quantityVehicle")
	quantityVehicle, err := strconv.ParseInt(quantityVehicleStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid quantityVehicle format: %v", err)})
		return
	}
	vehicle.QuantityVehicle = uint(quantityVehicle)

	receivedDateStr := c.PostForm("receivedDate")
	receivedDate, err := time.Parse("2006-01-02", receivedDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid receivedDate format: %v", err)})
		return
	}
	vehicle.ReceivedDate = receivedDate

	vehicle.AvaliabilityStatus = c.PostForm("avaliabilityStatus")

	vehicleTypeID, err := strconv.ParseUint(c.PostForm("vehicleTypeID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid vehicleTypeID format: %v", err)})
		return
	}
	vehicle.VehicleTypeID = uint(vehicleTypeID)

	employeeID, err := strconv.ParseUint(c.PostForm("employeeID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid employeeID format: %v", err)})
		return
	}
	vehicle.EmployeeID = uint(employeeID)

	vehicle.Picture = filePath

	// บันทึกข้อมูลในฐานข้อมูล
	if err := db.Create(&vehicle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create vehicle: %v", err)})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Vehicle created successfully",
		"data":    vehicle,
	})
}

func DeleteVehicle(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var vehicle entity.Vehicle

	if err := db.Where("id = ?", id).First(&vehicle).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Animal not found"})
		return
	}

	if err := db.Delete(&vehicle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete animal"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Animal deleted successfully"})
}

func ListVehicle(c *gin.Context) {
	var vehicle []entity.Vehicle

	db := config.DB()
	results := db.Preload("VehicleType").Preload("Employee").Find(&vehicle)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, vehicle)
}

func GetVehicleById(c *gin.Context) {
	id := c.Param("id") 
	db := config.DB()

	var vehicle entity.Vehicle

	if err := db.Preload("VehicleType").Preload("Employee").Where("id = ?", id).First(&vehicle).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
		return
	}

	c.JSON(http.StatusOK, vehicle)
}

func UpdateVehicle(c *gin.Context) {
    var vehicle entity.Vehicle
    db := config.DB()

    // รับ ID ของ Vehicle ที่จะอัปเดต
    id := c.Param("id")
    if id == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Missing vehicle ID"})
        return
    }

    // ค้นหาข้อมูล Vehicle จากฐานข้อมูล
    if err := db.Where("id = ?", id).First(&vehicle).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Vehicle not found"})
        return
    }

    // Parse ข้อมูลจากฟอร์ม
    if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
        return
    }

    // อัปเดตข้อมูลฟิลด์อื่นๆ
    vehicle.Name = c.PostForm("Name")
    
    // Update ReceivedDate (if provided in form)
    receivedDateStr := c.PostForm("ReceivedDate")
    if receivedDateStr != "" {
        receivedDate, err := time.Parse("2006-01-02", receivedDateStr) // Example format "YYYY-MM-DD"
        if err == nil {
            vehicle.ReceivedDate = receivedDate
        }
    }

    vehicle.AvaliabilityStatus = c.PostForm("Status")
    
    // Update Price if provided
    priceStr := c.PostForm("PriceForRent")
    if priceStr != "" {
        price, err := strconv.ParseFloat(priceStr, 64)
        if err == nil {
            vehicle.Price = price
        }
    }

    // Update QuantityVehicle if provided
    quantityStr := c.PostForm("QuantityVehicle")
    if quantityStr != "" {
        quantity, err := strconv.Atoi(quantityStr)
        if err == nil {
            vehicle.QuantityVehicle = uint(quantity)
        }
    }

    // อัปเดตรูปภาพถ้ามีการอัปโหลดใหม่
    file, err := c.FormFile("Picture") // ใช้ชื่อคีย์ "Picture"
    if err == nil && file != nil {
        // ลบไฟล์รูปภาพเก่าที่ไม่ได้ใช้แล้ว (หากมี)
        if vehicle.Picture != "" {
            oldFilePath := filepath.Join("uploads", vehicle.Picture)
            os.Remove(oldFilePath) // ลบไฟล์เก่า
        }

        // สร้างชื่อไฟล์ใหม่โดยไม่ใช้ vehicle.Name
        uploadDir := "uploads"
        if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
            return
        }

        // สร้างชื่อไฟล์ใหม่โดยใช้แค่ชื่อไฟล์เดิม
        newFileName := file.Filename // ใช้ชื่อไฟล์เดิมที่อัปโหลด
        filePath := filepath.Join(uploadDir, newFileName)

        // บันทึกรูปภาพใหม่
        if err := c.SaveUploadedFile(file, filePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
            return
        }

        vehicle.Picture = "uploads/" + newFileName // อัปเดตชื่อไฟล์ภาพในฐานข้อมูล
    }

    // Update foreign keys if provided (VehicleTypeID, EmployeeID)
    vehicleTypeIDStr := c.PostForm("Type")
    if vehicleTypeIDStr != "" {
        vehicleTypeID, err := strconv.Atoi(vehicleTypeIDStr)
        if err == nil {
            vehicle.VehicleTypeID = uint(vehicleTypeID)
        }
    }

    employeeIDStr := c.PostForm("EmployeeID")
    if employeeIDStr != "" {
        employeeID, err := strconv.Atoi(employeeIDStr)
        if err == nil {
            vehicle.EmployeeID = uint(employeeID)
        }
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    if err := db.Save(&vehicle).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to update vehicle: %v", err)})
        return
    }

    // ส่งข้อมูลที่อัปเดตกลับไป
    c.JSON(http.StatusOK, gin.H{
        "message": "Vehicle updated successfully",
        "data":    vehicle,
    })
}




/*func ServeImage(c *gin.Context) {
    fileName := c.Param("filename")
    filePath := filepath.Join("uploads", fileName)

    if _, err := os.Stat(filePath); os.IsNotExist(err) {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบไฟล์"})
        return
    }

    c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
    c.Header("Pragma", "no-cache")
    c.Header("Expires", "0")

    c.File(filePath)
}*/