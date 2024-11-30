import axios from "axios";
import { Vetdashboardinterface } from "../../../interface/VetDashboard";

const apiUrl = "http://localhost:8000";


async function getAllAnimals() { 
    try {
      // ส่งคำขอไปยัง backend
      const response = await axios.get(`${apiUrl}/getallanimal`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log(response.data)
  
      // ตรวจสอบว่า response.data เป็น array และมีข้อมูลครบถ้วน
      if (Array.isArray(response.data)) {
        // เช็คว่าแต่ละ animal object มีข้อมูลครบทุกฟิลด์ที่คาดหวัง
        response.data.forEach(animal => {
          if (!animal.hasOwnProperty("biological") || 
              !animal.hasOwnProperty("behavior") || 
              !animal.hasOwnProperty("sex") || 
              !animal.hasOwnProperty("employee")) {
            console.warn("Missing fields in animal data:", animal);
          }
        });
  
        return response.data as Vetdashboardinterface[]; // คืนค่าข้อมูลที่เป็น array ของสัตว์
      } else {
        throw new Error("ไม่สามารถดึงข้อมูลสัตว์ได้");
      }
    } catch (error) {
      console.error("Error fetching animals: ", error);
      throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลสัตว์");
    }
}

export {
    getAllAnimals
  };
  