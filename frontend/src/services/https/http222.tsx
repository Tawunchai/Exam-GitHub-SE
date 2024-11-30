import axios from "axios";
import { LoginInterface } from "../../interface/Login";
import { Vetdashboardinterface } from "../../interface/VetDashboard";

const apiUrl = "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");
  return {
    "Authorization": `${tokenType} ${token}`,
    "Content-Type": "application/json",
  };
}

const requestOptions = {
  headers: getAuthHeaders(),
};

async function AddLogin(data: LoginInterface) {
  return await axios  
    .post(`${apiUrl}/login`, data, requestOptions)
    .then((res) => res) 
    .catch((e) => e.response);
}

async function getAllProductStock() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  //console.log("requestOptions", requestOptions);
  let res = await fetch(`${apiUrl}/getallproductstock`, requestOptions) 
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });
  return res;
}

async function GetDataEmployeeByID(userid: string | null) {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  //console.log("requestOptions", requestOptions);
  let res = await fetch(`${apiUrl}/getdataemployeebyid/${userid}`, requestOptions) 
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });
  return res;
}

async function SearchProductReceive(Product: any) {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/searchproductreceive?barcodeproduct=${Product}`, requestOptions) 
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });
  return res;
}

async function AddReceiveProduct(formData: FormData) {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { 
      "Authorization": `${tokenType} ${token}`,
    },
    body: formData,
  };

  try {
    const response = await fetch(`${apiUrl}/addreceiveproduct`, requestOptions);

    if (!response.ok) {
      // ถ้าคำขอไม่สำเร็จ (status code ไม่ใช่ 2xx)
      throw new Error(`Error: ${response.statusText}`);
    }

    // ตรวจสอบว่า response มีข้อมูลหรือไม่
    const result = await response.json();  // แปลงข้อมูลเป็น JSON โดยตรง
    return result;

  } catch (error) {
    console.error("Request failed", error);
    return { success: false };
  }
}


async function GetProductForOrganize() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  //console.log("requestOptions", requestOptions);
  let res = await fetch(`${apiUrl}/getproductfororganize`, requestOptions) 
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });
  return res;
}


async function AddShelfZone(shelfzone: any) {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Authorization": `${tokenType} ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shelfzone), // ต้องเป็น JSON string
  };

  let res = await fetch(`${apiUrl}/addshelfzone`, requestOptions) 
    .then((res) => {
        return res.json();  ///อ่าน err ของ Backend 
    });
  return res;
}



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
  AddLogin,
  getAllProductStock,
  GetDataEmployeeByID,
  SearchProductReceive,
  AddReceiveProduct,
  GetProductForOrganize,
  AddShelfZone,
  getAllAnimals
};
