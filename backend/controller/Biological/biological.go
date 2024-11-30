package biological

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
)

func ListBiological(c *gin.Context) {
	var biologicals []entity.Biological

	db := config.DB()

	db.Find(&biologicals)

	c.JSON(http.StatusOK, &biologicals)
}
