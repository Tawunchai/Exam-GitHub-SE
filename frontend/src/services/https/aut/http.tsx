import axios from "axios";
const apiUrl = "http://localhost:8000";


function getAuthHeaders() {
    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("token_type");
    return {
      "Authorization": `${tokenType} ${token}`,
      "Content-Type": "application/json",
    };
}

async function getAllProductStock() {
    const requestOptions = {
        method: "GET",
        headers: getAuthHeaders(),
    };

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


async function GetAllShelfZone() {

  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/getallshelfzone`, requestOptions) 
      .then((res) => {
          return res.json();  ///อ่าน err ของ Backend 
      });
  return res;
}

async function AddProductToShelfZone(data: any) {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");

  const requestOptions: RequestInit = {
      method: "POST",
      headers: {
      "Authorization": `${tokenType} ${token}`,
      "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // ต้องเป็น JSON string
  };

  let res = await fetch(`${apiUrl}/addproducttoshelfzone`, requestOptions) 
      .then((res) => {
        return res;
      });
  return res;
}


async function SearchProductSale(barcode: any) {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  let res = await fetch(`${apiUrl}/searchproductsale?barcodeproduct=${barcode}`, requestOptions) 
  .then((res) => {    //1
    return res.json();  //2
  });//3
  return res;//4    ใช้4บรรทัดนี้อ่าน Error ได้
}



async function AddSaleProduct(DataSaleProduct: any) {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      "Authorization": `${tokenType} ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(DataSaleProduct),
  };

  const response = await fetch(`${apiUrl}/addsaleproduct`, requestOptions);
  const result = await response.json();//ตัวอ่าน  ข้อความ หรือ Error จาก backend

  if (response.ok) {
    console.log("AddSaleProduct:", response);
    console.log("Message from Backend:", result.message);
  } else {
    console.log("AddSaleProduct:", response);
    console.log("Error from Backend:", result.error);
  }

  return response;
}



export {
    getAllProductStock,
    GetDataEmployeeByID,
    SearchProductReceive,
    AddReceiveProduct,
    GetProductForOrganize,
    AddShelfZone,
    GetAllShelfZone,
    AddProductToShelfZone,
    SearchProductSale,
    AddSaleProduct,
};