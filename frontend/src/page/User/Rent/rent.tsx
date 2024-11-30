import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Divider, Button } from "antd";
import "./Rent.css";

const ImageGallery: React.FC = () => {
  const images = [
    { src: "https://via.placeholder.com/150", caption: "รูปที่ 1" },
    { src: "https://via.placeholder.com/150/FF0000", caption: "รูปที่ 2" },
    { src: "https://via.placeholder.com/150/00FF00", caption: "รูปที่ 3" },
    { src: "https://via.placeholder.com/150/0000FF", caption: "รูปที่ 4" },
    { src: "https://via.placeholder.com/150/FFFF00", caption: "รูปที่ 5" },
    { src: "https://via.placeholder.com/150/FF00FF", caption: "รูปที่ 6" },
    { src: "https://via.placeholder.com/150/00FFFF", caption: "รูปที่ 7" },
  ];

  return (
    <>
    <div className="container">
      <div className="text"><div>message</div><div>go</div></div>
      <div className="gallery-container">
        <div className="image-row">
          {images.map((image, index) => (
            <div key={index} className="image-container">
            <img
              src={image.src}
              alt={`Gallery ${index}`}
              className="image"
            />
            <div className="caption">{image.caption}</div>
          </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ position: "fixed", bottom: "5%", right: "50px"}}>
    <Link to="/booked" style={{ display: 'block' }}>
                <Button type="primary" block style={{ backgroundColor: '#696969', borderColor: '#696969', color: '#FFFFFF', width: '300px' }}>
                  Choose
                </Button>
              </Link>
    </div>
    </>
  );
};

const Rent: React.FC = () => {
  const location = useLocation();
  const selectedDate = location.state?.selectedDate || "No date selected";

  // สร้างตัวเลือกเวลา
  const availableTimes = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const [selectedTime, setSelectedTime] = useState<string>("08:00");

  // คำนวณเวลาเริ่มต้นและสิ้นสุด
  const startTime = new Date();
  const [hours] = selectedTime.split(":").map(Number);
  startTime.setHours(hours, 0, 0);

  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

  return (
    <div>
      <h1>Rent</h1>
      <p>Selected Date: {selectedDate}</p>
      <label htmlFor="timePicker">Select Time: </label>
      <select
        id="timePicker"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
      >
        {availableTimes.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <p>
        Period Time:{" "}
        {startTime.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}{" "}
        -{" "}{endTime.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
      </p>
      <div>Golf Cart </div>
      <ImageGallery />
    </div>
  );
};

export default Rent;


