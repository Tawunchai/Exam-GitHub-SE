package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
)

func ListMedicalType(c *gin.Context) {
	var MedicalTypes []entity.MedicineType

	db := config.DB()

	db.Find(&MedicalTypes)

	c.JSON(http.StatusOK, &MedicalTypes)
}