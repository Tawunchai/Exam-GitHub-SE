package config

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/Tawunchai/Zootopia/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

type CustomLogger struct{}

func (l *CustomLogger) LogMode(level logger.LogLevel) logger.Interface {
	return l
}

func (l *CustomLogger) Info(ctx context.Context, msg string, args ...interface{}) {}

func (l *CustomLogger) Warn(ctx context.Context, msg string, args ...interface{}) {}

func (l *CustomLogger) Error(ctx context.Context, msg string, args ...interface{}) {
	if !strings.Contains(msg, "record not found") {
		log.Printf(msg, args...)
	}
}

func (l *CustomLogger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	// ไม่ทำอะไรใน Trace
}

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("Zootopia.db?cache=shared"), &gorm.Config{
		Logger: &CustomLogger{},
	})

	if err != nil {
		panic("failed to connect database")
	}

	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {

	db.AutoMigrate(
		&entity.Animal{},
		&entity.Sex{},
		&entity.Behavioral{},
		&entity.Biological{},
		&entity.Employee{},
		&entity.Habitat{},
		&entity.Event{},
		&entity.Work{},
		&entity.Report{},
		&entity.Zone{},
		&entity.Like{},
		&entity.Review{},
		&entity.Calendar{},
		&entity.User{},
		&entity.Genders{},
		&entity.UserRoles{},
		&entity.Booking{},
		&entity.Rent{},
		&entity.TicketBooking{},
		&entity.TicketGeneration{},
		&entity.Ticket{},
		&entity.VehicleType{},
		&entity.Vehicle{},
		&entity.ShelfZone{},
		&entity.Product{},
		&entity.PaymentProduct{},
		&entity.ListProductSale{},
		&entity.OrderReceiving{},
		&entity.ListReceiving{},
		&entity.PaymentTicket{},

		&entity.Medicalrecord{},
		&entity.Treatment{},
		&entity.Prescription{},
		&entity.Medicine{},
		&entity.MedicineType{},
		&entity.StockOfFood{},
		&entity.ContainerOfFood{},
		&entity.CatagoryOfFood{},
	)

	GenderMale := entity.Genders{Gender: "Male"}
	GenderFemale := entity.Genders{Gender: "Female"}

	db.FirstOrCreate(&GenderMale, &entity.Genders{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Genders{Gender: "Female"})

	AdminRole := entity.UserRoles{RoleName: "Admin"}
	UserRole := entity.UserRoles{RoleName: "User"}
	ZookeeperRole := entity.UserRoles{RoleName: "Zookeeper"}
	VeterinarianRole := entity.UserRoles{RoleName: "Veterinarian"}
	ZooSaleRole := entity.UserRoles{RoleName: "ZooSale"}
	VehicleManagerRole := entity.UserRoles{RoleName: "VehicleManager"}

	db.FirstOrCreate(&AdminRole, &entity.UserRoles{RoleName: "Admin"})
	db.FirstOrCreate(&UserRole, &entity.UserRoles{RoleName: "User"})
	db.FirstOrCreate(&ZookeeperRole, &entity.UserRoles{RoleName: "Zookeeper"})
	db.FirstOrCreate(&VeterinarianRole, &entity.UserRoles{RoleName: "Veterinarian"})
	db.FirstOrCreate(&ZooSaleRole, &entity.UserRoles{RoleName: "ZooSale"})
	db.FirstOrCreate(&VehicleManagerRole, &entity.UserRoles{RoleName: "VehicleManager"})

	SexMale := entity.Sex{Sex: "Male"}
	SexFemale := entity.Sex{Sex: "Female"}

	db.FirstOrCreate(&SexMale, &entity.Sex{Sex: "Male"})
	db.FirstOrCreate(&SexFemale, &entity.Sex{Sex: "Female"})

	Behavioral1 := entity.Behavioral{Behavioral: "Eat meat"}
	Behavioral2 := entity.Behavioral{Behavioral: "Eat plants"}

	db.FirstOrCreate(&Behavioral1, &entity.Behavioral{Behavioral: "Eat meat"})
	db.FirstOrCreate(&Behavioral2, &entity.Behavioral{Behavioral: "Eat plants"})

	Biological1 := entity.Biological{Biological: "Avian"}
	Biological2 := entity.Biological{Biological: "Mammalian"}

	db.FirstOrCreate(&Biological1, &entity.Biological{Biological: "Avian"})
	db.FirstOrCreate(&Biological2, &entity.Biological{Biological: "Mammalian"})

	zone1 := entity.Zone{
		Zone:        "Rainforest",
		Description: "Tropical rainforest with a variety of wildlife.",
		Picture:     "uploads/landscape-1.png",
	}
	zone2 := entity.Zone{
		Zone:        "Savannah",
		Description: "Expansive savannah with African wildlife.",
		Picture:     "uploads/landscape-2.png",
	}
	zone3 := entity.Zone{
		Zone:        "Oceanarium",
		Description: "Aquatic animals and marine life exhibits.",
		Picture:     "uploads/landscape-3.png",
	}

	db.FirstOrCreate(&zone1, entity.Zone{Zone: "Rainforest"})
	db.FirstOrCreate(&zone2, entity.Zone{Zone: "Savannah"})
	db.FirstOrCreate(&zone3, entity.Zone{Zone: "Oceanarium"})

	habitat1 := entity.Habitat{
		Name:     "Tropical Habitat",
		Size:     2500.00,
		Capacity: 50,
		Picture:  "uploads/landscape-3.png",
		ZoneID:   zone1.ID,
	}

	habitat2 := entity.Habitat{
		Name:     "African Plains Habitat",
		Size:     3000.00,
		Capacity: 75,
		Picture:  "uploads/landscape-3.png",
		ZoneID:   zone2.ID,
	}

	db.FirstOrCreate(&habitat1, entity.Habitat{Name: "Tropical Habitat"})
	db.FirstOrCreate(&habitat2, entity.Habitat{Name: "African Plains Habitat"})

	Employee := uint(1)

	Animal1 := entity.Animal{
		Name:        "Lion",
		Description: "King of the Savannah",
		Weight:      190.5,
		Height:      1.2,
		Birthplace:  "Africa",
		BirthDay:    time.Date(2018, 5, 15, 0, 0, 0, 0, time.UTC),
		Picture:     "uploads/lion.jpg",
		Health:      "Healthy",
		Note:        "Active and healthy",

		SexID:        SexMale.ID,
		BiologicalID: Biological2.ID, // Mammalian
		BehavioralID: Behavioral1.ID, // Eat meat
		HabitatID:    habitat1.ID,    // Savannah
		EmployeeID:   1,              // Fixed Employee ID
	}

	Animal2 := entity.Animal{
		Name:        "Parrot",
		Description: "A colorful tropical bird",
		Weight:      1.5,
		Height:      0.3,
		Birthplace:  "South America",
		BirthDay:    time.Date(2020, 3, 10, 0, 0, 0, 0, time.UTC),
		Picture:     "uploads/parrot.jpg",
		Health:      "Healthy",
		Note:        "Lively and playful",

		SexID:        SexFemale.ID,
		BiologicalID: Biological1.ID,
		BehavioralID: Behavioral2.ID,
		HabitatID:    habitat2.ID,
		EmployeeID:   1,
	}

	// สร้างข้อมูลสัตว์ลงในฐานข้อมูล
	db.FirstOrCreate(&Animal1, entity.Animal{Name: "Lion"})
	db.FirstOrCreate(&Animal2, entity.Animal{Name: "Parrot"})

	// Creating initial Calendar events
	initialCalendars := []entity.Calendar{
		{
			Title:      "Animal Feeding",
			StartDate:  time.Date(2024, 11, 20, 8, 0, 0, 0, time.UTC), // Example: 2024-11-20 08:00:00 UTC
			AllDay:     true,
			EmployeeID: &Employee, // Associate with employee (e.g., employee ID)
		},
		{
			Title:      "Health Checkup",
			StartDate:  time.Date(2024, 11, 22, 10, 0, 0, 0, time.UTC), // Example: 2024-11-22 10:00:00 UTC
			AllDay:     true,
			EmployeeID: &Employee,
		},
	}

	// Insert initial Calendar events if they don't already exist
	for _, calendar := range initialCalendars {
		db.FirstOrCreate(&calendar, entity.Calendar{Title: calendar.Title, StartDate: calendar.StartDate})
	}

	birthDayStr, _ := time.Parse("2006-01-02", "1999-01-01")
	Admin := entity.User{
		Username:   "admin",
		FirstName:  "Kanyopron",
		LastName:   "Khundej",
		Email:      "Kanyopron@gmail.com",
		Password:   "123",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   2,
		UserRoleID: 1,
	}
	db.FirstOrCreate(&Admin, entity.User{Username: "admin"})

	Zookeeper := entity.User{
		Username:   "zookeeper",
		FirstName:  "Tawunchai",
		LastName:   "Burakhon",
		Email:      "tawunchaien@gmail.com",
		Password:   "123",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   1,
		UserRoleID: 3,
	}
	db.FirstOrCreate(&Zookeeper, entity.User{Username: "zookeeper"})

	Veterinarian := entity.User{
		Username:   "vet",
		FirstName:  "Nuttagun",
		LastName:   "Samanjai",
		Email:      "Nuttagun@gmail.com",
		Password:   "123",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   1,
		UserRoleID: 4,
	}
	db.FirstOrCreate(&Veterinarian, entity.User{Username: "vet"})

	ZooSale := entity.User{
		Username:   "zoosale",
		FirstName:  "Rattaphon",
		LastName:   "Phonthaisong",
		Email:      "Rattaphon@gmail.com",
		Password:   "123",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   1,
		UserRoleID: 5,
	}
	db.FirstOrCreate(&ZooSale, entity.User{Username: "zoosale"})

	VehicleManager := entity.User{
		Username:   "vehiclemanager",
		FirstName:  "janisatar",
		LastName:   "Tangkarachangjit",
		Email:      "janisatar@gmail.com",
		Password:   "123",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   1,
		UserRoleID: 6,
	}
	db.FirstOrCreate(&VehicleManager, entity.User{Username: "vehiclemanager"})

	// User 1
	User1 := entity.User{
		Username:   "user1",
		FirstName:  "Janis",
		LastName:   "Green",
		Email:      "janis.green@example.com",
		Password:   "password1",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   1,
		UserRoleID: 2,
	}
	db.FirstOrCreate(&User1, entity.User{Username: "animalkeeper"})

	// User 2
	User2 := entity.User{
		Username:   "user2",
		FirstName:  "Chris",
		LastName:   "Taylor",
		Email:      "chris.taylor@example.com",
		Password:   "password2",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   2,
		UserRoleID: 2,
	}
	db.FirstOrCreate(&User2, entity.User{Username: "vetassistant"})

	// User 3
	User3 := entity.User{
		Username:   "user3",
		FirstName:  "Alex",
		LastName:   "Smith",
		Email:      "alex.smith@example.com",
		Password:   "password3",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   1,
		UserRoleID: 2,
	}
	db.FirstOrCreate(&User3, entity.User{Username: "zoodirector"})

	// User 4
	User4 := entity.User{
		Username:   "user4",
		FirstName:  "Emily",
		LastName:   "Johnson",
		Email:      "emily.johnson@example.com",
		Password:   "password4",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   2,
		UserRoleID: 2,
	}
	db.FirstOrCreate(&User4, entity.User{Username: "tourguide"})

	// User 5
	User5 := entity.User{
		Username:   "user5",
		FirstName:  "Michael",
		LastName:   "Brown",
		Email:      "michael.brown@example.com",
		Password:   "password5",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   1,
		UserRoleID: 2,
	}
	db.FirstOrCreate(&User5, entity.User{Username: "ticketmanager"})

	// User 6
	User6 := entity.User{
		Username:   "user6",
		FirstName:  "Sophia",
		LastName:   "Davis",
		Email:      "sophia.davis@example.com",
		Password:   "password6",
		Birthday:   birthDayStr,
		Profile:    "uploads/parrot.jpg",
		GenderID:   2,
		UserRoleID: 2,
	}
	db.FirstOrCreate(&User6, entity.User{Username: "eventplanner"})

	eid5 := uint(5)
	Employee1 := entity.Employee{
		Bio:        "Experienced zookeeper with a passion for animal care.",
		Experience: "5 years of experience working in animal care and zoo management.",
		Education:  "Bachelor's degree in Animal Science.",
		Salary:     30000,
		FullTime:   true,
		UserID:     &eid5,
	}
	db.FirstOrCreate(&Employee1, entity.Employee{UserID: &eid5})

	eid6 := uint(6)
	Employee2 := entity.Employee{
		Bio:        "Veterinary professional specialized in exotic animals.",
		Experience: "3 years of experience as a veterinarian for zoo animals.",
		Education:  "Doctor of Veterinary Medicine.",
		Salary:     25000,
		FullTime:   false,
		UserID:     &eid6,
	}
	db.FirstOrCreate(&Employee2, entity.Employee{UserID: &eid6})

	uid1 := uint(1)
	uid2 := uint(2)
	uid3 := uint(3)
	uid4 := uint(4)

	Review1 := &entity.Review{
		Rating:     5,
		Comment:    "The zoo was incredibly well-maintained, and the animals looked happy and healthy. The staff were friendly and knowledgeable, always ready to share interesting facts about the animals. I loved the interactive exhibits, especially the feeding sessions with the giraffes! Its a great place for families, and theres something for everyone to enjoy. I can't wait to visit again!",
		ReviewDate: time.Now(),
		Picture:    "uploads/zooEvent1.jpg",
		UserID:     &uid1,
	}

	Review2 := &entity.Review{
		Rating:     4,
		Comment:    "The zoo had a wide variety of animals, and the staff were helpful. However, some areas felt overcrowded, and a few enclosures looked outdated. The food options were decent, but a bit overpriced. Its a nice place to visit, but it could be even better with a few updates",
		ReviewDate: time.Now(),
		Picture:    "uploads/zooEvent1.jpg",
		UserID:     &uid2,
	}

	Review3 := &entity.Review{
		Rating:     3,
		Comment:    "The animals were interesting, and the staff seemed to care about them. However, some enclosures felt too small, and the facilities could have been cleaner. The ticket price was a bit high for the experience provided. It was okay, but I wouldnt rush back.",
		ReviewDate: time.Now(),
		Picture:    "uploads/zooEvent1.jpg",
		UserID:     &uid3,
	}

	Review4 := &entity.Review{
		Rating:     2,
		Comment:    "The zoo was not well-maintained, and several exhibits were closed. Many enclosures seemed small and lacked enrichment for the animals. The staff were not very attentive, and the overall atmosphere felt uninviting. Unfortunately, I wouldnt recommend visiting.",
		ReviewDate: time.Now(),
		Picture:    "uploads/zooEvent1.jpg",
		UserID:     &uid4,
	}

	db.FirstOrCreate(Review1, &entity.Review{UserID: &uid1})
	db.FirstOrCreate(Review2, &entity.Review{UserID: &uid2})
	db.FirstOrCreate(Review3, &entity.Review{UserID: &uid3})
	db.FirstOrCreate(Review4, &entity.Review{UserID: &uid4})

	//Vehicle
	VehicleType1 := entity.VehicleType{VehicleType: "Bicycle"}
	VehicleType2 := entity.VehicleType{VehicleType: "Golf Cart"}

	db.FirstOrCreate(&VehicleType1, &entity.VehicleType{VehicleType: "Bicycle"})
	db.FirstOrCreate(&VehicleType2, &entity.VehicleType{VehicleType: "Golf Cart"})

	Vehicle1 := entity.Vehicle{
		Name:               "A01",
		ReceivedDate:       time.Date(2018, 5, 15, 0, 0, 0, 0, time.UTC),
		AvaliabilityStatus: "Available",
		Price:              20,
		QuantityVehicle:    1,
		Picture:            "uploads/bicycle.jpg",

		VehicleTypeID: VehicleType1.ID,
		EmployeeID:    1,
	}

	Vehicle2 := entity.Vehicle{
		Name:               "D01",
		ReceivedDate:       time.Date(2018, 5, 15, 0, 0, 0, 0, time.UTC),
		AvaliabilityStatus: "Available",
		Price:              100,
		QuantityVehicle:    1,
		Picture:            "uploads/golf.jpg",

		VehicleTypeID: VehicleType2.ID,
		EmployeeID:    1,
	}

	db.FirstOrCreate(&Vehicle1, entity.Vehicle{Name: "A01"})
	db.FirstOrCreate(&Vehicle2, entity.Vehicle{Name: "D01"})

	//TicketGeneration
	TicketGeneration1 := entity.TicketGeneration{Generation: "Child"}
	TicketGeneration2 := entity.TicketGeneration{Generation: "Adult"}
	TicketGeneration3 := entity.TicketGeneration{Generation: "Other"}

	db.FirstOrCreate(&TicketGeneration1, &entity.TicketGeneration{Generation: "Child"})
	db.FirstOrCreate(&TicketGeneration2, &entity.TicketGeneration{Generation: "Adult"})
	db.FirstOrCreate(&TicketGeneration3, &entity.TicketGeneration{Generation: "Other"})

	db.FirstOrCreate(&entity.MedicineType{MedicineType: "ยาปฏิชีวนะสำหรับสัตว์"})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "ยาป้องกันและกำจัดปรสิต"})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "วัคซีนสำหรับสัตว์ "})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "ยาลดการอักเสบและบรรเทาปวด"})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "ยารักษาปัญหาในระบบย่อยอาหาร"})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "ยาสำหรับการรักษาโรคผิวหนัง"})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "ยาสำหรับระบบทางเดินหายใจ"})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "ยาสำหรับโรคทางระบบสืบพันธุ์"})
	db.FirstOrCreate(&entity.MedicineType{MedicineType: "วิตามินและอาหารเสริม"})

	expiryDateStr, _ := time.Parse("2006-01-02", "2026-06-30") // ตัวอย่างวันที่หมดอายุ
	db.FirstOrCreate(&entity.Medicine{
		MedicineName:   "Cefazolin",
		Dosage:         "1 g",
		Stock:          50,
		ExpiryDate:     expiryDateStr,
		Price:          180.00,
		MedicineTypeID: 1,
	})

	expiryDateStr2, _ := time.Parse("2006-01-02", "2025-11-15") // ตัวอย่างวันที่หมดอายุ
	db.FirstOrCreate(&entity.Medicine{
		MedicineName:   "Moxidectin",
		Dosage:         "2 mg/ml",
		Stock:          120,
		ExpiryDate:     expiryDateStr2,
		Price:          200.00,
		MedicineTypeID: 2,
	})

	expiryDateStr3, _ := time.Parse("2006-01-02", "2026-04-25") // ตัวอย่างวันที่หมดอายุ
	db.FirstOrCreate(&entity.Medicine{
		MedicineName:   "Distemper Vaccine",
		Dosage:         "1 ml",
		Stock:          200,
		ExpiryDate:     expiryDateStr3,
		Price:          350.00,
		MedicineTypeID: 3,
	})

	// เพิ่มข้อมูล Booking
	userID7 := uint(7)
	userID8 := uint(8)
	userID9 := uint(9)
	userID10 := uint(10)
	userID11 := uint(11)

	Booking1 := &entity.Booking{
		BookingDate: time.Now(),
		AllPrice:    250.0,
		UserID:      &userID7,
	}

	Booking2 := &entity.Booking{
		BookingDate: time.Now(),
		AllPrice:    250.0,
		UserID:      &userID8,
	}

	Booking3 := &entity.Booking{
		BookingDate: time.Now(),
		AllPrice:    250.0,
		UserID:      &userID9,
	}

	Booking4 := &entity.Booking{
		BookingDate: time.Now(),
		AllPrice:    250.0,
		UserID:      &userID10,
	}

	Booking5 := &entity.Booking{
		BookingDate: time.Now(),
		AllPrice:    250.0,
		UserID:      &userID11,
	}

	db.FirstOrCreate(Booking1, &entity.Booking{UserID: &userID7})
	db.FirstOrCreate(Booking2, &entity.Booking{UserID: &userID8})
	db.FirstOrCreate(Booking3, &entity.Booking{UserID: &userID9})
	db.FirstOrCreate(Booking4, &entity.Booking{UserID: &userID10})
	db.FirstOrCreate(Booking5, &entity.Booking{UserID: &userID11})

	//Ticket
	ticket1 := entity.Ticket{}
	ticket2 := entity.Ticket{}
	ticket3 := entity.Ticket{}
	ticket4 := entity.Ticket{}
	ticket5 := entity.Ticket{}
	ticket6 := entity.Ticket{}
	ticket7 := entity.Ticket{}
	db.FirstOrCreate(&ticket1, &entity.Ticket{Description: "Rainforest zone For Child", Price: 50, TicketGenerationID: &TicketGeneration1.ID})
	db.FirstOrCreate(&ticket2, &entity.Ticket{Description: "Rainforest zone For Adult", Price: 100, TicketGenerationID: &TicketGeneration2.ID})
	db.FirstOrCreate(&ticket3, &entity.Ticket{Description: "Rainforest and Savannah For Child", Price: 110, TicketGenerationID: &TicketGeneration1.ID})
	db.FirstOrCreate(&ticket4, &entity.Ticket{Description: "Rainforest and Savannah For Adult", Price: 160, TicketGenerationID: &TicketGeneration2.ID})
	db.FirstOrCreate(&ticket5, &entity.Ticket{Description: "Rainforest, Savannah and Oceanarium For Child", Price: 170, TicketGenerationID: &TicketGeneration1.ID})
	db.FirstOrCreate(&ticket6, &entity.Ticket{Description: "Rainforest, Savannah and Oceanarium For Adult", Price: 250, TicketGenerationID: &TicketGeneration2.ID})
	db.FirstOrCreate(&ticket7, &entity.Ticket{Description: "All zones For Baby and Elderly people", Price: 0, TicketGenerationID: &TicketGeneration3.ID})

	// ผูก Zone และ Ticket เข้าด้วยกัน (zone_ticket)
	db.Model(&ticket1).Association("Zones").Append(&zone1)
	db.Model(&ticket2).Association("Zones").Append(&zone1, &zone2)
	db.Model(&ticket3).Association("Zones").Append(&zone1, &zone2, &zone3)
	db.Model(&ticket4).Association("Zones").Append(&zone1)
	db.Model(&ticket5).Association("Zones").Append(&zone1, &zone2)
	db.Model(&ticket6).Association("Zones").Append(&zone1, &zone2, &zone3)
	db.Model(&ticket7).Association("Zones").Append(&zone1, &zone2, &zone3)

	BookingID1 := uint(1)
	BookingID2 := uint(2)
	BookingID3 := uint(3)
	BookingID4 := uint(4)
	BookingID5 := uint(5)

	PaymentTicket1 := &entity.PaymentTicket{
		Amount:        540.0,
		PaymentDate:   time.Now(),
		Path:          "uploads/ticket.jpg",
		PaymentStatus: "Complete",
		BookingID:     &BookingID1,
	}
	PaymentTicket2 := &entity.PaymentTicket{
		Amount:        540.0,
		PaymentDate:   time.Now(),
		Path:          "uploads/ticket.jpg",
		PaymentStatus: "No",
		BookingID:     &BookingID2,
	}
	PaymentTicket3 := &entity.PaymentTicket{
		Amount:        500.0,
		PaymentDate:   time.Now(),
		Path:          "uploads/ticket.jpg",
		PaymentStatus: "Complete",
		BookingID:     &BookingID3,
	}
	PaymentTicket4 := &entity.PaymentTicket{
		Amount:        170.0,
		PaymentDate:   time.Now(),
		Path:          "uploads/ticket.jpg",
		PaymentStatus: "No",
		BookingID:     &BookingID4,
	}
	PaymentTicket5 := &entity.PaymentTicket{
		Amount:        480.0,
		PaymentDate:   time.Now(),
		Path:          "uploads/ticket.jpg",
		PaymentStatus: "Complete",
		BookingID:     &BookingID5,
	}

	db.FirstOrCreate(PaymentTicket1, &entity.PaymentTicket{BookingID: &BookingID1})
	db.FirstOrCreate(PaymentTicket2, &entity.PaymentTicket{BookingID: &BookingID2})
	db.FirstOrCreate(PaymentTicket3, &entity.PaymentTicket{BookingID: &BookingID3})
	db.FirstOrCreate(PaymentTicket4, &entity.PaymentTicket{BookingID: &BookingID4})
	db.FirstOrCreate(PaymentTicket5, &entity.PaymentTicket{BookingID: &BookingID5})

	TicketBooking1 := entity.TicketBooking{
		VisitDate:        time.Date(2018, 5, 15, 0, 0, 0, 0, time.UTC),
		QuantityCustomer: 2,
		TotalPrice:       500,
		Checking:         true,

		TicketID:  &ticket6.ID,
		BookingID: &Booking1.ID,
	}

	TicketBooking2 := entity.TicketBooking{
		VisitDate:        time.Date(2018, 5, 15, 0, 0, 0, 0, time.UTC),
		QuantityCustomer: 3,
		TotalPrice:       580,
		Checking:         false,

		TicketID:  &ticket3.ID,
		BookingID: &Booking2.ID,
	}

	TicketBooking3 := entity.TicketBooking{
		VisitDate:        time.Date(2018, 5, 15, 0, 0, 0, 0, time.UTC),
		QuantityCustomer: 9,
		TotalPrice:       700,
		Checking:         false,

		TicketID:  &ticket2.ID,
		BookingID: &Booking3.ID,
	}

	db.FirstOrCreate(&TicketBooking1, entity.TicketBooking{QuantityCustomer: 2})
	db.FirstOrCreate(&TicketBooking2, entity.TicketBooking{QuantityCustomer: 4})
	db.FirstOrCreate(&TicketBooking3, entity.TicketBooking{QuantityCustomer: 5})

	//Commit Test Master
	// OMG test.db Tawunchai
	// Test.bd
	// OMG
}