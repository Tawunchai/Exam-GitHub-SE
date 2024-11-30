package main

import (
	"net/http"

	"github.com/Tawunchai/Zootopia/config"
	"github.com/Tawunchai/Zootopia/controller"
	animal "github.com/Tawunchai/Zootopia/controller/Animal"
	behavioral "github.com/Tawunchai/Zootopia/controller/Behavioral"
	biological "github.com/Tawunchai/Zootopia/controller/Biological"
	calendar "github.com/Tawunchai/Zootopia/controller/Calendar"
	event "github.com/Tawunchai/Zootopia/controller/Event"
	habitat "github.com/Tawunchai/Zootopia/controller/Habitat"
	like "github.com/Tawunchai/Zootopia/controller/Like"
	report "github.com/Tawunchai/Zootopia/controller/Report"
	review "github.com/Tawunchai/Zootopia/controller/Review"
	sex "github.com/Tawunchai/Zootopia/controller/Sex"
	vehicle "github.com/Tawunchai/Zootopia/controller/Vehicle"
	zone "github.com/Tawunchai/Zootopia/controller/Zone"
	"github.com/Tawunchai/Zootopia/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {

	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	r.POST("/login", controller.AddLogin)

	authorized := r.Group("")
	authorized.Use(middlewares.Authorizes())
	{
		r.Static("/imageproduct", "./imageproduct/")

		// Animals Routes
		authorized.POST("/animals-create", animal.CreateAnimal)
		authorized.GET("/animals", animal.ListAnimals)
		authorized.DELETE("/animals/:id", animal.DeleteAnimal)
		authorized.GET("/animal/:id", animal.GetAnimalById)
		authorized.PATCH("/animals/:id", animal.UpdateAnimal)

		// Zone Routes
		authorized.GET("/zones", zone.ListZone)

		// Sex Routes
		authorized.GET("/sexs", sex.ListSex)

		// Biological Routes
		authorized.GET("/behaviorals", behavioral.ListBehaviorals)

		// Biological Routes
		authorized.GET("/biologicals", biological.ListBiological)

		// Report Routes
		authorized.POST("/reports-create", report.CreateReport)
		authorized.GET("/reports", report.ListReport)
		authorized.GET("/animals-sick", animal.ListAnimalsByHealth)
		authorized.DELETE("/reports/:id", report.DeleteReport)

		//Calendar Routes
		authorized.GET("/calendar", calendar.ListCalendar)
		authorized.POST("/create-calendar", calendar.CreateCalendar)
		authorized.DELETE("/delete-calendar/:id", calendar.DeleteCalendar)

		//Review Routes
		authorized.GET("/user-review/:id", review.GetUserByIdReviews)
		authorized.GET("/reviews", review.ListReview)
		authorized.GET("/reviews/:userID", review.ListReviewByUserID)
		authorized.POST("/reviews-create", review.CreateReview)
		authorized.GET("/ratings", review.GetAllRatingsAvg)
		authorized.GET("/reviews/filter", review.GetFilteredReviews)
		authorized.GET("/reviews/search", review.SearchReviewsByKeyword)
		authorized.GET("/bookings/user/:id", review.ListBookingsByUserID)
		authorized.PATCH("/reviews/:id", review.UpdateReview)
		authorized.GET("/review/:id",review.GetReviewByID)

		//Like Routes
		authorized.POST("/reviews/like", like.LikeReview)
		authorized.DELETE("/reviews/unlike", like.UnlikeReview)
		authorized.GET("/reviews/:userID/:reviewID/like", like.CheckUserLikeStatus)

		//Event Routes
		authorized.POST("/events-create", event.CreateEvent)
		authorized.GET("/events", event.ListEvent)
		authorized.DELETE("/events/:id", event.DeleteEvent)
		authorized.GET("/event/:id", event.GetEventById)
		authorized.PATCH("/events/:id", event.UpdateEvent)

		//Habitat Routes
		authorized.POST("/habitats-create", habitat.CreateHabitat)
		authorized.GET("/habitats", habitat.ListHabitat)
		authorized.DELETE("/habitats/:id", habitat.DeleteHabitat)
		authorized.GET("/habitat/:id", habitat.GetHabitatById)
		authorized.PATCH("/habitats/:id", habitat.UpdateHabitat)

		// Vehicle Routes
		authorized.POST("/vehicles-create", vehicle.CreateVehicle)
		authorized.GET("/vehicles", vehicle.ListVehicle)
		authorized.DELETE("/vehicles/:id", vehicle.DeleteVehicle)
		authorized.GET("/vehicles/:id", vehicle.GetVehicleById)
		authorized.PATCH("/vehicles/:id", vehicle.UpdateVehicle)

		authorized.GET("/getallproductstock", controller.GetAllProductStock)
		authorized.GET("/getdataemployeebyid/:id", controller.GetDataEmployeeByID)
		authorized.GET("/searchproductreceive", controller.SearchProductReceive)
		authorized.POST("/addreceiveproduct", controller.AddReceiveProduct)
		authorized.GET("/getproductfororganize", controller.GetProductForOrganize)
		authorized.POST("/addshelfzone", controller.AddShelfZone)
		authorized.GET("/getallanimal", controller.GetAllAnimals)
		authorized.POST("/createanimal", controller.CreateAnimal)
		authorized.GET("/getanimalbyid/:id", controller.GetAnimalByID)
		authorized.PUT("/updateanimalbyid/:id", controller.UpdateAnimal)
		authorized.DELETE("/deleteanimalbyid/:id", controller.DeleteAnimal)
		authorized.GET("/getallreport", controller.GetAllReport)
		authorized.POST("/addreport", controller.CreateReport)
		authorized.PUT("/updatereportbyid/:id", controller.GetAllReport)

		authorized.GET("/getallprescription", controller.GetAllPresciption)
		authorized.POST("/addprescription", controller.CreatePrescription)
		authorized.PUT("/updateprescriptionbyid/:id", controller.UpdatePrescription)
		authorized.DELETE("/deleteprescriptionbyid/:id", controller.DeletePrescriptionByID)
		authorized.GET("/getprescriptionbyid/:id", controller.GetPrescriptionByID)

		authorized.GET("/getallmedicine", controller.GetAllMedicine)
		authorized.GET("/getmedicinebyid/:id", controller.GetMedicineByID)
		authorized.GET("/listmedicinetype", controller.ListMedicalType)
		authorized.POST("/addmedicine", controller.CreateMedicine)
		authorized.PUT("/updatemedicinebyid/:id", controller.UpdateMedicineByID)
		authorized.DELETE("/deletemedicinebyid/:id", controller.DeleteMedicineByID)

		authorized.GET("/getallmedicinerecord", controller.GetAllMedicalRcord)
		authorized.GET("/getmedicinerecordbyid/:id", controller.GetMedicalRecordByID)
		authorized.POST("/addmedicalrecord", controller.CreateMedicalRecord)
		authorized.PUT("/updatemedicalrecordbyid/:id", controller.UpdateMedicalRecord)
		authorized.DELETE("/deletemedicalrecordbyid/:id", controller.DeleteMedicalRecordByID)

		authorized.GET("gettreatmentbyid/:id", controller.GetTreamentPlanByID)
		authorized.POST("/addmtreatment", controller.CreateTreatmenPlan)
		authorized.PUT("/updatetreatmentbyid/:id", controller.UpdateTreatmentPlan)
		authorized.DELETE("/deletetreatmentbyid/:id", controller.DeleteTreatmentByID)

		authorized.POST("/addtreatment_and_medicalrecord", controller.CreateTreatmentandMedicalRecord)
		authorized.PUT("/updatetreatment_and_medicalrecordbyid/:id", controller.UpdateTreatmentAndMedicalRecord)
		authorized.DELETE("/deletereatment_and_medicalrecordbyid/:id", controller.DeleteTreatmentAndMedicalRecord)

		authorized.GET("/getallshelfzone", controller.GetAllShelfZone)
		authorized.POST("/addproducttoshelfzone", controller.AddProductToShelfZone)
		authorized.GET("/searchproductsale", controller.SearchProductSale)
		authorized.POST("/addsaleproduct", controller.AddSaleProduct)
	}

	public := r.Group("")
	{
		public.GET("/uploads/:filename", animal.ServeImage)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
