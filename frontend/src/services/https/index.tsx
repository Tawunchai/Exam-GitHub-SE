import axios from "axios";
import { CalendarInterface } from "../../interface/ICalendar";
import { ReviewInterface } from "../../interface/IReview";
import { UsersInterface } from "../../interface/IUser";
import { EventsInterface } from "../../interface/IEvent";
import { HabitatInterface } from "../../interface/IHabitat";
import { AnimalsInterface } from "../../interface/IAnimal";

const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");
const requestOptions = {
  headers: {
    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,
  },
};

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

const updateRequestOptions = (body: any) => {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");
  return {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
    body: JSON.stringify(body), 
  };
};

const formDataRequestOptions = (method: string, formData: FormData) => {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");

  return {
    method: method,
    headers: {
      Authorization: `${Bearer} ${Authorization}`,
    },
    body: formData,
  };
};


const postRequestOptions = (body: any) => {
  const Authorization = localStorage.getItem("token");
  const Bearer = localStorage.getItem("token_type");
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
    body: JSON.stringify(body), 
  };
};

export const getCalendars = async (): Promise<CalendarInterface[]> => { 
  try {
    const requestOptions = getRequestOptions(); 
    const response = await axios.get<CalendarInterface[]>(`${apiUrl}/calendar`, requestOptions);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching calendars: " + (error as Error).message);
  }
};


export const createCalendar = async ( // 
  calendar: Omit<CalendarInterface, "id">
): Promise<CalendarInterface> => {
  try {
    const requestOptions = postRequestOptions(calendar); 
    const response = await fetch(`${apiUrl}/create-calendar`, requestOptions); 
    if (!response.ok) {
      throw new Error("Error creating calendar");
    }
    const data: CalendarInterface = await response.json(); 
    return data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error("Error creating calendar: " + (error as Error).message);
  }
};



export const deleteCalendar = async (calendarId: number): Promise<void> => {
  try {
    const requestOptions = deleteRequestOptions(); 

    await axios.delete(`${apiUrl}/delete-calendar/${calendarId}`, requestOptions); 

  } catch (error) {
    throw new Error("Error deleting calendar: " + (error as Error).message);
  }
};


// Reviews API

export const ListReview = async (): Promise<ReviewInterface[] | false> => {
  try {
    const requestOptions = getRequestOptions(); 

    const response = await fetch(`${apiUrl}/reviews`, requestOptions); 

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลรีวิว:", error);
    return false;
  }
};

export const listReviewsByUserID = async (userID: number): Promise<ReviewInterface[] | false> => {
  try {
    const response = await fetch(`${apiUrl}/reviews/${userID}`, getRequestOptions());
    if (!response.ok) throw new Error("Failed to fetch reviews.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return false;
  }
};



export const GetUserByIdReview = async (id: number | undefined): Promise<UsersInterface | false> => {
  try {
    if (id === undefined) return false;

    const requestOptions = getRequestOptions(); 

    const response = await fetch(`${apiUrl}/user-review/${id}`, requestOptions); 

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลผู้ใช้ตาม ID:", error);
    return false;
  }
};

export const CreateReview = async (formData: FormData): Promise<any | false> => {
  try {
    const Authorization = localStorage.getItem("token");
    const Bearer = localStorage.getItem("token_type");

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `${Bearer} ${Authorization}`, 
      },
      body: formData, 
    };

    const response = await fetch(`${apiUrl}/reviews-create`, requestOptions);

    if (!response.ok) {
      // Log the response to understand what went wrong
      console.error("Response status:", response.status);
      throw new Error("Invalid response from server");
    }

    const data = await response.json();
    console.log("Response data:", data); // Debugging the response structure
    return data; // Ensure the returned object contains `id`
  } catch (error) {
    console.error("Error creating review:", error);
    return false;
  }
};


export const listBookingsByUserID = async (userID: number): Promise<any | false> => {
  try {
    const response = await axios.get(`${apiUrl}/bookings/user/${userID}`, getRequestOptions());  

    if (response.status === 200) {
      return response.data;  
    } else {
      throw new Error("Error fetching bookings");
    }
  } catch (error) {
    console.error("Error fetching bookings by user ID:", error);
    return false;
  }
};

// Get review by ID
export const GetReviewsByID = async (id: number): Promise<ReviewInterface | false> => {
  try {
    const requestOptions = getRequestOptions(); // Using utility function
    const response = await fetch(`${apiUrl}/review/${id}`, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to fetch review by ID");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    return false;
  }
};

// Update review
export const UpdateReview = async (
  id: number,
  data: ReviewInterface,
  file?: File
): Promise<ReviewInterface | false> => {
  const formData = new FormData();
  console.log("Updating review data:", data);

  // Append all review data to formData
  for (const key in data) {
    if (data[key as keyof ReviewInterface] !== undefined) {
      formData.append(key, data[key as keyof ReviewInterface] as string);
    }
  }

  // Append the file if provided
  if (file) {
    formData.append("Picture", file);
  }

  try {
    const requestOptions = formDataRequestOptions("PATCH", formData); // Using utility function

    const response = await fetch(`${apiUrl}/reviews/${id}`, requestOptions);
    if (!response.ok) {
      throw new Error("Failed to update review");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating review:", error);
    return false;
  }
};





export const GetAllRatingsAvg = async (): Promise<{ rating: number; percentage: number }[] | false> => {
  try {
    const requestOptions = getRequestOptions(); 

    const response = await fetch(`${apiUrl}/ratings`, requestOptions);

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    const data = await response.json();

    if (!Array.isArray(data.ratings)) return false;

    const ratings: number[] = data.ratings;
    const ratingCount = ratings.length;

    const ratingSummary = ratings.reduce<{ [key: number]: number }>(  
      (acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      },
      {}
    );

    const avgRatings = Object.keys(ratingSummary).map((rating) => ({
      rating: Number(rating),
      percentage: (ratingSummary[Number(rating)] / ratingCount) * 100,  
    }));

    return avgRatings;
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงค่าเฉลี่ยคะแนนรีวิว:", error);
    return false;
  }
};
// complete

// Like Button Click Handler
export const onLikeButtonClick = async ( 
  reviewID: number,
  userID: number
): Promise<any | false> => {
  try {
    const postOptions = postRequestOptions({ user_id: userID, review_id: reviewID }); 

    const response = await fetch(`${apiUrl}/reviews/like`, postOptions);

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการกดไลค์:", error);
    return false;
  }
};

// Fetch Like Status
export const fetchLikeStatus = async (
  reviewID: number,
  userID: number
): Promise<{ hasLiked: boolean; likeCount: number } | false> => {
  try {
    const requestOptions = getRequestOptions();

    const response = await fetch(`${apiUrl}/reviews/${userID}/${reviewID}/like`, requestOptions);
    
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    const data = await response.json();
    return {
      hasLiked: data.hasLiked ?? false,
      likeCount: data.likeCount ?? 0,
    };
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงสถานะไลค์:", error);
    return false;
  }
};


// Unlike Button Click Handler
export const onUnlikeButtonClick = async (reviewID: number, userID: number) => {
  try {
    const deleteOptions = deleteRequestOptions(); 

    const response = await fetch(`${apiUrl}/reviews/unlike`, {
      ...deleteOptions, 
      body: JSON.stringify({ user_id: userID, review_id: reviewID }), 
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการยกเลิกไลค์:", error);
    return false;
  }
};


// Function to Get Filtered Reviews by Star Level
export const GetFilteredReviews = async (
  starLevel: string
): Promise<ReviewInterface[] | false> => {
  try {
    const query = new URLSearchParams();
    query.append("starLevel", starLevel); 

    const requestOptions = getRequestOptions(); 

    const response = await fetch(
      `${apiUrl}/reviews/filter?${query.toString()}`, 
      {
        ...requestOptions, 
        method: "GET",
      }
    );

    if (response.status === 204) return []; 
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");

    return await response.json(); 
  } catch {
    return false; 
  }
};

// Function to Search Reviews by Keyword
export const SearchReviewsByKeyword = async (
  keyword: string
): Promise<ReviewInterface[] | false> => {
  try {
    const query = new URLSearchParams();
    query.append("keyword", keyword);

    const requestOptions = getRequestOptions(); 

    const response = await fetch(
      `${apiUrl}/reviews/search?${query.toString()}`, 
      {
        ...requestOptions, 
        method: "GET",
      }
    );

    if (response.status === 204) return [];
    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");

    return await response.json(); 
  } catch (error) {
    console.error("ข้อผิดพลาดในการค้นหารีวิวตามคำสำคัญ:", error);
    return false;
  }
};



//Event API
// Create Event Function with Authorization
export const CreateEvent = async (formData: FormData): Promise<any | false> => {
  try {
    const response = await fetch(`${apiUrl}/events-create`, {
      method: "POST",
      body: formData, 
      headers: {
        Authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 201) throw new Error("Invalid response from server");

    return await response.json();
  } catch (error) {
    console.error("Error creating event:", error);
    return false;
  }
};

// List Event Function with Authorization
export const ListEvent = async (): Promise<EventsInterface[] | false> => {
  try {
    const response = await fetch(`${apiUrl}/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลรีวิว:", error);
    return false;
  }
};

// Delete Event by ID Function with Authorization
async function DeleteEventByID(id: number | undefined) {
  const requestOptions = deleteRequestOptions(); 

  let res = await fetch(`${apiUrl}/events/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}

// Get Event by ID Function with Authorization
async function GetEventById(id: number | undefined) {
  const requestOptions = getRequestOptions(); 

  let res = await fetch(`${apiUrl}/event/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

// Update Event Function with Authorization and FormData
async function UpdateEvent(data: EventsInterface, file?: File) {
  console.log("Data Event Update:",data)
  const formData = new FormData();
  
  for (const key in data) {
    formData.append(key, data[key as keyof EventsInterface] as string);
  }

  if (file) {
    formData.append("Picture", file);
  }

  const requestOptions = {
    method: "PATCH",
    body: formData,
    headers: {
      Authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("token")}`,
    },
  };

  let res = await fetch(`${apiUrl}/events/${data.ID}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


// Habitat API - List Habitats with Authorization
export const ListHabitat = async (): Promise<HabitatInterface[] | false> => {
  try {
    const response = await fetch(`${apiUrl}/habitats`, getRequestOptions()); 

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูล habitat:", error);
    return false;
  }
};

// Habitat API - Create Habitat with Authorization
export const CreateHabitat = async (formData: FormData): Promise<any | false> => {
  try {
    const response = await axios.post(`${apiUrl}/habitats-create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  
        Authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("token")}`, 
      },
    });

    if (response.status !== 201) {
      throw new Error('Failed to create habitat.');
    }

    return response.data;  
  } catch (error) {
    console.error("Error creating habitat:", error);
    return false;  
  }
};

// Animal API - Get Animal by ID with Authorization
export const GetHabitatById = async (id: number | undefined): Promise<HabitatInterface | false> => {
  try {
    const response = await fetch(`${apiUrl}/habitat/${id}`, getRequestOptions()); // Using getRequestOptions

    if (response.status === 200) {
      return await response.json();
    } else {
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลสัตว์ตาม ID:", error);
    return false;
  }
};

async function UpdateHabitat(data: HabitatInterface, file?: File) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key as keyof HabitatInterface] as string);
  }

  if (file) {
    formData.append("Picture", file);
  }
  console.log("Data Habitat update",data)
  const requestOptions = formDataRequestOptions("PATCH", formData);

  try {
    const res = await fetch(`${apiUrl}/habitats/${data.ID}`, requestOptions);
    if (res.status === 200) {
      return await res.json();
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating animal:", error);
    return false;
  }
}

export const DeleteHabitatByID = async (id: number | undefined): Promise<boolean> => {
  try {
    const response = await fetch(`${apiUrl}/habitats/${id}`, deleteRequestOptions()); 

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการลบสัตว์:", error);
    return false;
  }
};


//Animal API
async function GetSexs() {
  const requestOptions = getRequestOptions(); 

  let res = await fetch(`${apiUrl}/sexs`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetBiological() {
  const requestOptions = getRequestOptions(); 

  let res = await fetch(`${apiUrl}/biologicals`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetBehaviorals() {
  const requestOptions = getRequestOptions(); 

  let res = await fetch(`${apiUrl}/behaviorals`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetZones() {
  const requestOptions = getRequestOptions(); 

  let res = await fetch(`${apiUrl}/zones`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


//Animal API
// Animal API - List Animals with Authorization
export const ListAnimal = async (): Promise<AnimalsInterface[] | false> => {
  try {
    const response = await fetch(`${apiUrl}/animals`, getRequestOptions()); 

    if (!response.ok) throw new Error("การตอบสนองของเครือข่ายไม่ถูกต้อง");
    return await response.json();
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลสัตว์:", error);
    return false;
  }
};

// Animal API - Create Animal with Authorization
export const CreateAnimal = async (formData: FormData): Promise<any | false> => {
  try {
    const response = await axios.post(`${apiUrl}/animals-create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",  
        Authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("token")}`,  
      },
    });

    if (response.status !== 201) {
      throw new Error("Error creating animal");
    }

    return response.data;  
  } catch (error) {
    console.error("Error creating animal:", error);
    return false;  
  }
};

// Animal API - Delete Animal by ID with Authorization
export const DeleteAnimalByID = async (id: number | undefined): Promise<boolean> => {
  try {
    const response = await fetch(`${apiUrl}/animals/${id}`, deleteRequestOptions()); // Using deleteRequestOptions

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการลบสัตว์:", error);
    return false;
  }
};

// Animal API - Get Animal by ID with Authorization
export const GetAnimalById = async (id: number | undefined): Promise<AnimalsInterface | false> => {
  try {
    const response = await fetch(`${apiUrl}/animal/${id}`, getRequestOptions()); // Using getRequestOptions

    if (response.status === 200) {
      return await response.json();
    } else {
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการดึงข้อมูลสัตว์ตาม ID:", error);
    return false;
  }
};

// Animal API - Update Animal with Authorization
async function UpdateAnimal(data: AnimalsInterface, file?: File) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key as keyof AnimalsInterface] as string);
  }

  if (file) {
    formData.append("Picture", file);
  }
  console.log("Data Animal update",data)
  const requestOptions = formDataRequestOptions("PATCH", formData);

  try {
    const res = await fetch(`${apiUrl}/animals/${data.ID}`, requestOptions);
    if (res.status === 200) {
      return await res.json();
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating animal:", error);
    return false;
  }
}

//Report API
export const CreateReport = async (formData: FormData): Promise<any | false> => {
  try {
    const requestOptions = formDataRequestOptions("POST", formData); // Using the utility for form data requests

    const response = await fetch(`${apiUrl}/reports-create`, requestOptions);

    if (!response.ok) throw new Error("Failed to create report.");

    return await response.json(); // Return the report data if successful
  } catch (error) {
    console.error("Error creating report:", error);
    return false; // Return false if there is an error
  }
};

// Service สำหรับดึงรายงาน
export const ListReports = async () => {
  try {
    const options = getRequestOptions(); 
    const response = await axios(`${apiUrl}/reports`, options);
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Service สำหรับดึงสัตว์ที่ป่วย
export const GetAnimalByHealth = async () => {
  try {
    const options = getRequestOptions(); 
    const response = await axios(`${apiUrl}/animals-sick`, options);
    return response.data;
  } catch (error) {
    console.error('Error fetching sick animals:', error);
    throw error;
  }
};

export const DeleteReportByID = async (id: number | undefined): Promise<boolean> => {
  try {
    const response = await fetch(`${apiUrl}/reports/${id}`, deleteRequestOptions()); // Using deleteRequestOptions

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาดในการลบสัตว์:", error);
    return false;
  }
};

export {
  GetSexs,
  GetBiological,
  GetBehaviorals,
  GetZones,
  DeleteEventByID,
  GetEventById,
  UpdateEvent,
  UpdateAnimal,
  UpdateHabitat,
};