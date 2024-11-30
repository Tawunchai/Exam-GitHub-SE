package sex

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
)

func ListSex(c *gin.Context) {
	var sexs []entity.Sex

	db := config.DB()

	db.Find(&sexs)

	c.JSON(http.StatusOK, &sexs)
}
