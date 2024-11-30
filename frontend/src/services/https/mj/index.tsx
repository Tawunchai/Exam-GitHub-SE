import { VehicleInterface } from "../../../interface/IVehicle";

const apiUrl = "http://localhost:8000";

const getRequestOptions = () => {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };
};

const deleteRequestOptions = () => {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");
  return {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };
};


const postRequestOptions = (body: any) => {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");

  let headers: Record<string, string> = {
    Authorization: `${Bearer} ${Authorization}`,
  };

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return {
    method: "POST",
    headers: headers, 
    body: body instanceof FormData ? body : JSON.stringify(body), 
  };
};



export const CreateVehicle = async (formData: FormData): Promise<any | false> => {
  console.log("Form Data:", formData);
  try {
    // ใช้ postRequestOptions
    const requestOptions = postRequestOptions(formData);

    // ส่งคำขอโดยใช้ fetch
    const response = await fetch(`${apiUrl}/vehicles-create`, requestOptions);

    // ตรวจสอบสถานะ
    if (response.status !== 201) {
      throw new Error("ไม่สามารถสร้างข้อมูลได้");
    }

    return await response.json();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างข้อมูล:", error);
    return false; // คืนค่า false ในกรณีเกิดข้อผิดพลาด
  }
};



async function GetVehicle() {
  const requestOptions = getRequestOptions();

  let res = await fetch(`${apiUrl}/vehicles`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function DeleteVehicleByID(id: Number | undefined) {
  const requestOptions = deleteRequestOptions();

  let res = await fetch(`${apiUrl}/vehicles/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}

async function UpdateVehicle(data: VehicleInterface, file?: File) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key as keyof VehicleInterface] as string);
  }

  if (file) {
    formData.append("Picture", file);
  }
  console.log(file)
  console.log(data)

  console.log("Test formdata: ",formData);

  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");

  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `${Bearer} ${Authorization}`,
    },
    body: formData,
  };

  let res = await fetch(`${apiUrl}/vehicles/${data.ID}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetVehicleById(id: Number | undefined) {
  const requestOptions = getRequestOptions();

  let res = await fetch(`${apiUrl}/vehicles/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

export {
  GetVehicle,
  DeleteVehicleByID,
  UpdateVehicle,
  GetVehicleById,
};
