package behavioral

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/entity"
)

func ListBehaviorals(c *gin.Context) {
	var behaviorals []entity.Behavioral

	db := config.DB()

	db.Find(&behaviorals)

	c.JSON(http.StatusOK, &behaviorals)
}
