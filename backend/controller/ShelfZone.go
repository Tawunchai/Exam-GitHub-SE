package controller

import (
	"net/http"
	"strconv"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddShelfZone(c *gin.Context) {
	var shelfZone entity.ShelfZone

	// Bind JSON payload to the ShelfZone struct
	if err := c.ShouldBindJSON(&shelfZone); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format", "details": err.Error()})
		return
	}

	// Validate required fields
	if shelfZone.Zonename == "" || shelfZone.Location == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Zonename and Location are required fields"})
		return
	}

	// Get the database connection
	db := config.DB()
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection is not initialized"})
		return
	}

	// Save ShelfZone to the database
	if err := db.Create(&shelfZone).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create ShelfZone", "details": err.Error()})
		return
	}

	// Respond with the created ShelfZone
	c.JSON(http.StatusOK, gin.H{
		"message":   "ShelfZone created successfully",
		"shelfZone": shelfZone,
	})
}

func GetAllShelfZone(c *gin.Context) {
    db := config.DB()

    var shelfZones []entity.ShelfZone 

    // ดึงข้อมูลทั้งหมดจากตาราง ShelfZone
    if err := db.Find(&shelfZones).Error; err != nil {
        // หากเกิดข้อผิดพลาดในการดึงข้อมูล ให้ส่งข้อความ error กลับ
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งข้อมูลทั้งหมดที่ดึงมาในรูปแบบ JSON
    c.JSON(http.StatusOK, shelfZones)
}


func AddProductToShelfZone(c *gin.Context) {
	var input struct {
		ShelfID      string  `json:"ShelfID"`
		PriceProduct float64 `json:"priceproduct"`
		ProductID    uint    `json:"productID"`
	}

	// รับข้อมูลจาก JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			//"error":   err.Error(),
			"message": "Invalid input data",
		})
		return
	}

	// แปลง ShelfID จาก string เป็น uint
	shelfID, err := strconv.ParseUint(input.ShelfID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			//"error":   err.Error(),
			"message": "Failed to parse ShelfID",
		})
		return
	}
	
	db := config.DB()

	// หา Product โดยใช้ ProductID
	var product entity.Product
	if err := db.First(&product, input.ProductID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				//"error":   err.Error(),
				"message": "Product not found",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				//"error":   err.Error(),
				"message": "Database error while fetching product",
			})
		}
		return
	}

	// อัพเดตราคาและ ShelfZone
	product.Price = input.PriceProduct
	product.ShelfZoneID = uint(shelfID)

	// บันทึกการเปลี่ยนแปลงในฐานข้อมูล
	if err := db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			//"error":   err.Error(),
			"message": "Failed to update product in database",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
	})
}

