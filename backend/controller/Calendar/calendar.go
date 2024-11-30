package calendar

import (
	"net/http"
	"time"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
	"github.com/gin-gonic/gin"
)

func ListCalendar(c *gin.Context) {
	var calendars []entity.Calendar

	// Query all calendars
	if err := config.DB().Preload("Employee").Find(&calendars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Remove invalid calendar data (with zero StartDate or empty Title) from the response
	var validCalendars []entity.Calendar
	for _, calendar := range calendars {
		// Skip calendars with invalid data
		if calendar.StartDate.IsZero() || calendar.Title == "" {
			continue
		}
		validCalendars = append(validCalendars, calendar)
	}

	// Return valid calendars
	c.JSON(http.StatusOK, validCalendars)
}

func CreateCalendar(c *gin.Context) {
	var input entity.Calendar

	// Bind incoming JSON to input struct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure EmployeeID is provided and valid
	if input.EmployeeID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "EmployeeID is required"})
		return
	}

	// Ensure StartDate is set, if not, set it to current time
	if input.StartDate.IsZero() {
		input.StartDate = time.Now() // Default to current time if StartDate is not provided
	}

	// Adjust the time to Asia/Bangkok timezone if needed
	loc, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load timezone"})
		return
	}

	// Adjust StartDate to the correct timezone
	input.StartDate = input.StartDate.In(loc)

	// Ensure Title is provided
	if input.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}

	// Create the new calendar event in the database
	if err := config.DB().Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, input)
}




func DeleteCalendar(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB().Delete(&entity.Calendar{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Calendar not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Calendar deleted successfully"})
}
