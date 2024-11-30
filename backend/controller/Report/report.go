package report

import (
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
	"github.com/gin-gonic/gin"
)

func CreateReport(c *gin.Context) {
	var report entity.Report
	db := config.DB()

	// รับรูปภาพจากฟอร์ม
	image, err := c.FormFile("picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// สร้างโฟลเดอร์สำหรับเก็บรูปภาพ (ถ้ายังไม่มี)
	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// บันทึกไฟล์รูปภาพ
	filePath := filepath.Join(uploadDir, image.Filename)
	if err := c.SaveUploadedFile(image, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// รับข้อมูลจากฟอร์ม
	report.Title = c.PostForm("title")
	report.Description = c.PostForm("description")

	// รับ ReportDate
	reportDateStr := c.PostForm("reportDate")
	reportDate, err := time.Parse("2006-01-02", reportDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report date format"})
		return
	}
	report.ReportDate = reportDate

	// รับ Status
	report.Status = c.PostForm("status")

	// รับ StatusVet
	report.StatusVet = c.PostForm("statusVet")

	// เก็บ path รูปภาพ
	report.Picture = filePath

	// รับ AnimalID
	animalIDStr := c.PostForm("animalID")
	animalID, err := strconv.ParseUint(animalIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid animal ID"})
		return
	}
	report.AnimalID = uint(animalID)

	// รับ EmployeeID
	employeeIDStr := c.PostForm("employeeID")
	employeeID, err := strconv.ParseUint(employeeIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employee ID"})
		return
	}
	report.EmployeeID = uint(employeeID)

	// บันทึกข้อมูลในฐานข้อมูล
	if err := db.Create(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Report created successfully", "data": report})
}

func ListReport(c *gin.Context) {
	var reports []entity.Report

	db := config.DB()
	results := db.Preload("Animal").Preload("Employee").Find(&reports)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, reports)
}

func DeleteReport(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	var report entity.Report

	if err := db.Where("id = ?", id).First(&report).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		return
	}

	if err := db.Delete(&report).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report deleted successfully"})
}