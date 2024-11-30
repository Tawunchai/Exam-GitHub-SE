export interface CalendarInterface {
  ID: number;              // ID ของกิจกรรม
    Title: string;           // ชื่อกิจกรรม
    StartDate: string;       // วันที่เริ่มต้น (ISO format)
    AllDay: boolean;         // เป็นกิจกรรมทั้งวันหรือไม่
    EmployeeID?: number;     // ID ของพนักงานที่เกี่ยวข้อง (ถ้ามี)
  }
  