package zone

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
)

func ListZone(c *gin.Context) {
	var zons []entity.Zone

	db := config.DB()

	db.Find(&zons)

	c.JSON(http.StatusOK, &zons)
}
