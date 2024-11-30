package controller

import (
	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
	"encoding/base64"
	"fmt"
	"strings"

	"io/ioutil"
	"net/http"
	"os"

	//"encoding/json"
	//"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	// "gorm.io/gorm"
)


// func GetAllProductStock(c *gin.Context) {
// 	db := config.DB()

// 	var products []entity.Product
// 	if err := db.Find(&products).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// ส่งข้อมูลทั้งหมดในรูปแบบ JSON โดยตรง
// 	c.JSON(http.StatusOK, products)
// }

func GetAllProductStock(c *gin.Context) {
    db := config.DB()

    // สร้างตัวแปรเก็บข้อมูลของ Product
    var products []entity.Product

    // ใช้ Preload เพื่อดึงข้อมูลที่เกี่ยวข้อง (เช่น ShelfZone)
    if err := db.Preload("ShelfZone").Find(&products).Error; err != nil {
        // ถ้ามีข้อผิดพลาดในการดึงข้อมูล
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งข้อมูลทั้งหมดในรูปแบบ JSON
    c.JSON(http.StatusOK, products)
}



func GetDataEmployeeByID(c *gin.Context) {
    userid := c.Param("id")
	db := config.DB()

    var employee entity.Employee
    if err := db.Where("user_id = ?", userid).First(&employee).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "EmployeeID not found"})
        return
    }
	// ส่งข้อมูลทั้งหมดในรูปแบบ JSON โดยตรง
	c.JSON(http.StatusOK, employee)
}



func SearchProductReceive(c *gin.Context) {
    barcodeProduct := c.Query("barcodeproduct")

    db := config.DB()

    var product entity.Product
    if err := db.Where("barcode = ?", barcodeProduct).First(&product).Error; err != nil {
        // หากไม่พบข้อมูล ให้ส่งสถานะ 404 Not Found
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }

    // อ่านไฟล์ภาพจาก path ที่เก็บในฐานข้อมูล
    imagePath := product.Path
    imageFile, err := os.Open(imagePath)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open image"})
        return
    }
    defer imageFile.Close()

    // อ่านไฟล์ภาพและแปลงเป็น base64
    imageBytes, err := ioutil.ReadAll(imageFile)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image"})
        return
    }

    encodedImage := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(imageBytes)

    // รวมข้อมูล product และ imageBase64 ลงใน map เดียว
    response := map[string]interface{}{
        "ID":         product.ID,
        "CreatedAt":  product.CreatedAt,
        "UpdatedAt":  product.UpdatedAt,
        "DeletedAt":  product.DeletedAt,
        "Name":       product.Name,
        "Price":      product.Price,
        "Piece":      product.Piece,
        "Barcode":    product.Barcode,
        "Path":       encodedImage, // เพิ่ม prefix ก่อน Base64
    }

    // ส่งข้อมูล JSON กลับไปที่ frontend
    c.JSON(http.StatusOK, response)
}



func AddReceiveProduct(c *gin.Context) {
    // ดึงค่า totalPrice จาก form ซึ่งจะเป็น string
    totalPriceStr := c.PostForm("totalPrice")
    employeeidStr := c.PostForm("employeeid")

    // แปลง totalPrice จาก string เป็น float64
    totalPrice, err := strconv.ParseFloat(totalPriceStr, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid totalPrice format"})
        return
    }
    
    employeeidInt, err := strconv.Atoi(employeeidStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employeeid format"})
        return
    }
    employeeid := uint(employeeidInt)

    db := config.DB()

    // สร้าง orderReceiving ก่อน
    orderReceiving := entity.OrderReceiving{
        Receiving_date: time.Now(),
        Total_price:    totalPrice, // ใช้ totalPrice ที่แปลงเป็น float64 แล้ว
        EmployeeID: employeeid,
    }

    // บันทึกข้อมูล OrderReceiving
    if err := db.Create(&orderReceiving).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order receiving"})
        return
    }

    // วนลูปผ่านข้อมูลที่ส่งมา
    for i := 0; ; i++ {
        prefix := fmt.Sprintf("products[%d]", i)

        // ตรวจสอบว่ามีข้อมูลผลิตภัณฑ์หรือไม่
        productID := c.PostForm(prefix + "[ID]")
        if productID == "" {
            // หยุดลูปเมื่อไม่มีข้อมูล ID
            break
        }

        // ตรวจสอบว่า ProductID นี้มีอยู่ในฐานข้อมูลหรือไม่
        var existingProduct entity.Product
        result := db.Where("id = ? AND deleted_at IS NULL", productID).First(&existingProduct)

        // ถ้าไม่พบข้อมูลในฐานข้อมูล
        if result.Error != nil {
            // กรณีไม่พบข้อมูลในระบบ จะไม่หยุดทำงาน
            // ถ้ามี pathBase64 ให้ดำเนินการสร้าง Product ใหม่
            pathBase64 := c.PostForm(prefix + "[Path]")
            if pathBase64 == "" {
                c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Product %d missing Path", i)})
                return
            }

            // ตัด prefix ออก (ถ้ามี)
            base64StartIndex := strings.Index(pathBase64, ",")
            if base64StartIndex != -1 {
                pathBase64 = pathBase64[base64StartIndex+1:]
            }

            // แปลง Base64 เป็นภาพ
            imageData, err := base64.StdEncoding.DecodeString(pathBase64)
            if err != nil {
                c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Product %d has invalid Path", i)})
                return
            }

            // สร้างโฟลเดอร์และบันทึกภาพ
            folderPath := "./imageproduct/"
            if err := os.MkdirAll(folderPath, os.ModePerm); err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
                return
            }

            // สร้างชื่อไฟล์
            currentTime := time.Now().Format("02-01-2006-15-04-05-000")
            fileName := fmt.Sprintf("%s-%s.jpg", productID, currentTime)
            filePath := folderPath + fileName

            // บันทึกไฟล์
            if err := os.WriteFile(filePath, imageData, 0644); err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to save image for product %d", i)})
                return
            }

            // แปลงข้อมูล Piece (quantityReceive)
            quantityReceiveStr := c.PostForm(prefix + "[quantityReceive]")
            piece := uint(0)
            if quantityReceiveStr != "" {
                pieceInt, err := strconv.Atoi(quantityReceiveStr)
                if err != nil {
                    c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid quantityReceive format for product %d", i)})
                    return
                }
                piece = uint(pieceInt)
            }

            // แปลงข้อมูล Price และตั้งค่าเป็น 0 หากไม่พบ
            priceStr := c.PostForm(prefix + "[Price]")
            price := 0.0
            if priceStr != "" {
                price, _ = strconv.ParseFloat(priceStr, 64)
            }

            // ใช้ Barcode ที่แยกต่างหากจาก productID
			barcode := c.PostForm(prefix + "[Barcode]")
			if barcode == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Product %d missing Barcode", i)})
				return
			}

			// ใช้ ID เป็น ProductID และ Barcode แยกต่างหาก
			newProduct := entity.Product{
				Barcode: barcode,  // ใช้ Barcode จากฟอร์ม
				Price:   price,
				Piece:   piece,
				Path:    filePath,  // บันทึก path หลังจากแปลงภาพแล้ว
				Name:    c.PostForm(prefix + "[Name]"),  // ดึงชื่อจากฟอร์ม
			}

            // บันทึก Product ใหม่
            if err := db.Create(&newProduct).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new product"})
                return
            }

            // สร้าง ListReceiving และโยงกับ Product ที่สร้างใหม่
            listReceiving := entity.ListReceiving{
                Quantity:         piece,
                ProductID:        newProduct.ID,
                OrderReceivingID: orderReceiving.ID,
            }
            if err := db.Create(&listReceiving).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create list receiving"})
                return
            }
        } else {
            // หากพบ Product ที่มีอยู่แล้วในฐานข้อมูล ให้สร้าง ListReceiving โดยไม่ต้องสร้าง Product ใหม่
            quantityReceiveStr := c.PostForm(prefix + "[quantityReceive]")
            piece := uint(0)
            if quantityReceiveStr != "" {
                pieceInt, err := strconv.Atoi(quantityReceiveStr)
                if err != nil {
                    c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid quantityReceive format for product %d", i)})
                    return
                }
                piece = uint(pieceInt)
            }

            // อัปเดตจำนวนสินค้าในฐานข้อมูล (เพิ่มจำนวนสินค้า)
            existingProduct.Piece += piece
            if err := db.Save(&existingProduct).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to update product %d", i)})
                return
            }

            // สร้าง ListReceiving และโยงกับ Product ที่มีอยู่แล้ว
            listReceiving := entity.ListReceiving{
                Quantity:         piece,
                ProductID:        existingProduct.ID,
                OrderReceivingID: orderReceiving.ID,
            }
            if err := db.Create(&listReceiving).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create list receiving"})
                return
            }
        }
    }

    // ส่ง response กลับ
    c.JSON(http.StatusOK, gin.H{
        "message":    "Products added successfully",
        "totalPrice": totalPrice,
    })
}



func GetProductForOrganize(c *gin.Context) {
	db := config.DB()

	var products []entity.Product
    if err := db.Where("price = ?", 0).Find(&products).Error; err != nil {
        // ตรวจสอบ error และส่งข้อความกลับ
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
	// ส่งข้อมูลทั้งหมดในรูปแบบ JSON โดยตรง
	c.JSON(http.StatusOK, products)
}

func SearchProductSale(c *gin.Context) {
    barcodeProduct := c.Query("barcodeproduct")

    db := config.DB()

    var product entity.Product
    if err := db.Where("barcode = ? AND price > 0", barcodeProduct).First(&product).Error; err != nil {
        // หากไม่พบข้อมูล ให้ส่งสถานะ 404 Not Found
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }

    // อ่านไฟล์ภาพจาก path ที่เก็บในฐานข้อมูล
    imagePath := product.Path
    imageFile, err := os.Open(imagePath)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open image"})
        return
    }
    defer imageFile.Close()

    // อ่านไฟล์ภาพและแปลงเป็น base64
    imageBytes, err := ioutil.ReadAll(imageFile)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image"})
        return
    }

    encodedImage := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(imageBytes)

    // รวมข้อมูล product และ imageBase64 ลงใน map เดียว
    response := map[string]interface{}{
        "ID":         product.ID,
        "CreatedAt":  product.CreatedAt,
        "UpdatedAt":  product.UpdatedAt,
        "DeletedAt":  product.DeletedAt,
        "Name":       product.Name,
        "Price":      product.Price,
        "Piece":      product.Piece,
        "Barcode":    product.Barcode,
        "Path":       encodedImage, // เพิ่ม prefix ก่อน Base64
    }

    // ส่งข้อมูล JSON กลับไปที่ frontend
    c.JSON(http.StatusOK, response)
}
