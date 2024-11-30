import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Modal, Input, message } from "antd";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  DateSelectArg,
  EventClickArg,
  EventSourceInput, 
} from "@fullcalendar/core";
import {
  getCalendars,
  createCalendar,
  deleteCalendar,
} from "../../../services/https";
import { CalendarInterface } from "../../../interface/ICalendar";
import { useNavigate } from "react-router-dom";
import "./calendar.css";

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState<EventSourceInput>([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<any | null>(null);
  const calendarRef = useRef<any>(null); 
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await getCalendars(); 
      console.log("Fetched data: ", data);
  
      if (data && Array.isArray(data)) {
        const events: EventSourceInput = data.map((task: CalendarInterface) => { 
          if (!task.Title || !task.StartDate) {
            console.error("Missing title or startDate:", task);
            return null; 
          }
  
          const parsedDate = new Date(task.StartDate);
          if (isNaN(parsedDate.getTime())) {
            console.error("Invalid startDate:", task.StartDate);
            return null; 
          }
  
          
          return {
            id: task.ID ? String(task.ID) : "",     
            title: task.Title,                       
            start: parsedDate,                       
            allDay: task.AllDay ?? true,             
          };
        }).filter((event) => event !== null); 
  
        console.log("Processed events: ", events);
  
        setCurrentEvents(events); 
      }
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลเหตุการณ์ได้");
      console.error("Error fetching calendars:", error);
    }
  };
  
  useEffect(() => {
    fetchTasks(); 
  }, []);

  const handleCreateTask = async () => {
    if (!modalTitle.trim() || !selectedDate) {
      message.warning("กรุณาระบุชื่อเหตุการณ์ให้ถูกต้อง");
      return;
    }
  
    // ตั้งเวลาให้เป็นเวลา 00:00:00 ของวันที่เลือก (ในเขตเวลา Asia/Bangkok)
    const startDate = new Date(selectedDate.startStr); 
    startDate.setHours(0, 0, 0, 0);  // ตั้งเวลาให้เป็น 00:00:00
  
    // แปลงเวลาเป็นรูปแบบ ISO string (โดยคำนึงถึงเขตเวลาของผู้ใช้)
    const isoDate = startDate.toISOString(); 
  
    const newCalendar: Omit<CalendarInterface, "ID"> & { ID: number } = {
      Title: modalTitle,
      StartDate: isoDate, // ใช้ ISO string เพื่อส่งไปยัง backend
      AllDay: true,
      EmployeeID: 1, 
      ID: 0,        
    };
  
    console.log("Creating Calendar Event with Payload:", newCalendar);
  
    try {
      await createCalendar(newCalendar); 
      setIsModalVisible(false);
      message.success("สร้างเหตุการณ์สำเร็จ!");
  
      fetchTasks(); 
      navigate("/zookeeper/calendar"); 
    } catch (error) {
      message.error("ไม่สามารถสร้างเหตุการณ์ได้");
    }
  };
  
  
  
  

  const handleEventClick = (selected: EventClickArg) => {
    Modal.confirm({
      title: `คุณแน่ใจหรือไม่ที่จะลบ "${selected.event.title}"?`,
      onOk: async () => {
        try {
          await deleteCalendar(Number(selected.event.id)); 
          selected.event.remove(); 
          message.success("ลบเหตุการณ์สำเร็จ");
        } catch {
          message.error("ไม่สามารถลบเหตุการณ์ได้");
        }
      },
    });
  };

  return (
    <div>
      <h1 className="header-calendar-box">
        <CalendarIcon size={28} style={{marginRight:"10px"}} />
        Calendar
      </h1>
      <div className="full-calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listMonth",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          events={currentEvents} 
          select={(e: DateSelectArg) => {
            setSelectedDate(e);
            setIsModalVisible(true); 
          }}
          eventClick={handleEventClick} 
        />
      </div>
      <Modal
        title="สร้างเหตุการณ์ใหม่"
        visible={isModalVisible}
        onOk={handleCreateTask}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={modalTitle}
          onChange={(e) => setModalTitle(e.target.value)} 
          placeholder="ชื่อเหตุการณ์"
        />
      </Modal>
    </div>
  );
};

export default Calendar;
