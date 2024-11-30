import React, { useState, useEffect } from 'react';
import { Button, Modal, DatePicker } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { Divider } from '@mui/material';
import { FaPaw } from 'react-icons/fa';

interface CalendarProps {
  onSelectDate: (date: string | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // เก็บวันที่ที่เลือก

  useEffect(() => {
    const savedDate = localStorage.getItem("selectedDate");
    if (savedDate) {
      setSelectedDate(savedDate); // โหลดวันที่ที่เก็บไว้ใน localStorage
      onSelectDate(savedDate); // อัพเดตวันที่ที่เลือกใน Ticket
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleDateSelect = (date: any) => {
    const formattedDate = date?.format("YYYY-MM-DD");
    setSelectedDate(formattedDate); // เก็บวันที่ที่เลือก
    onSelectDate(formattedDate); // ส่งค่าไปยัง Ticket
    localStorage.setItem("selectedDate", formattedDate); // บันทึกวันที่ลง localStorage
    console.log("Selected date:", formattedDate);
    setIsModalOpen(false); // ปิด Modal เมื่อเลือกวันที่แล้ว
  };

  return (
    <>
      <Button type="primary"
        onClick={showModal}
        style={{
          backgroundColor: '#FED400', 
          borderColor: '#FED400',
          color: '#048F0D', 
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '25px', 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
          height: '40px',
          width: '200px'
        }} >
        Date of Visit
      </Button>
      <Modal
        title="Select a Date"
        open={isModalOpen}
        footer={null} // ลบปุ่มยืนยันและยกเลิก
        onCancel={() => setIsModalOpen(false)} // ปิด Modal เมื่อคลิกที่ด้านนอก
      >
        <DatePicker 
          onChange={handleDateSelect} // ปิด Modal เมื่อเลือกวันที่
          style={{ width: '100%' }} // ขยายปฏิทินให้เต็มความกว้าง
        />
      </Modal>
      
      {selectedDate && <p>Selected Date: {selectedDate}</p>}
    </>
  );
};

const Counter: React.FC = () => {
  const [count, setCount] = useState(0); // กำหนดค่าตัวเลขเริ่มต้นเป็น 0

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={() => setCount(Math.max(count - 1, 0))}
        style={{
          position: 'relative', // ทำให้สามารถจัดตำแหน่งภายในได้
          backgroundColor: '#fdfefe', // สีพื้นหลัง
          border: 'none', // ไม่มีขอบ
          padding: '10px', // เพิ่ม padding ให้ปุ่ม
          cursor: 'pointer', // ให้แสดง cursor เมื่อ hover
        }}
      >
        <FaPaw
          style={{
            fontSize: '50px',
            color: '#895E3C',
            borderRadius: '30%',
            transition: 'box-shadow 0.3s ease, transform 0.2s ease', // เพิ่ม transition สำหรับเงาและการย่อขยาย
          }}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)'; // เพิ่มเงาขณะกด
            target.style.transform = 'scale(0.95)'; // ลดขนาดเล็กน้อยขณะกด
          }}
          onMouseUp={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'; // รีเซ็ตเงาหลังปล่อยปุ่ม
            target.style.transform = 'scale(1)'; // คืนขนาดเดิมหลังปล่อย
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)'; // เพิ่มเงาเมื่อเมาส์วาง
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = 'none'; // รีเซ็ตเงาหลังเมาส์ออก
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            color: '#fdfefe',
            fontWeight: 'bold',
          }}
        >
          -
        </span>
      </button>
      <span
        style={{
          fontSize: '20px',
          minWidth: '50px', // กำหนดพื้นที่ให้ตัวเลขอยู่ตรงกลางเสมอ
          textAlign: 'center',
        }}
      >
        {count}
      </span>
      <button
        onClick={() => setCount(Math.min(count + 1, 10))}
        style={{
          position: 'relative', // ทำให้สามารถจัดตำแหน่งภายในได้
          backgroundColor: '#fdfefe', // สีพื้นหลัง
          border: 'none', // ไม่มีขอบ
          padding: '10px', // เพิ่ม padding ให้ปุ่ม
          cursor: 'pointer', // ให้แสดง cursor เมื่อ hover
        }}
      >
        <FaPaw
          style={{
            fontSize: '50px',
            color: '#895E3C',
            borderRadius: '30%',
            transition: 'box-shadow 0.3s ease, transform 0.2s ease', // เพิ่ม transition สำหรับเงาและการย่อขยาย
          }}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)'; // เพิ่มเงาขณะกด
            target.style.transform = 'scale(0.95)'; // ลดขนาดเล็กน้อยขณะกด
          }}
          onMouseUp={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)'; // รีเซ็ตเงาหลังปล่อยปุ่ม
            target.style.transform = 'scale(1)'; // คืนขนาดเดิมหลังปล่อย
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)'; // เพิ่มเงาเมื่อเมาส์วาง
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLElement; // ใช้ type assertion
            target.style.boxShadow = 'none'; // รีเซ็ตเงาหลังเมาส์ออก
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px',
            color: '#fdfefe',
            fontWeight: 'bold',
          }}
        >
          +
        </span>
      </button>
    </div>
  );
}

const Ticket: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const confirm = () => {
    modal.confirm({
      title: 'Would you like to rent a vehicle?',
      icon: null,
      content: (
        <div>
          <p>"The rental period for each vehicle is limited to 2 hours."</p>
          <br />
          <p>Bicycle for Child  ฿10</p>
          <p>Bicycle for Adult  ฿20</p>
          <p>Bicycle for Adult&Baby  ฿10</p>
          <br />
          <p>Golf Cart for 4 people  ฿100</p>
          <p>Golf Cart for 6 people  ฿150</p>
        </div>
      ),
      okText: "Rent",
      cancelText: "No, Thanks",
      onOk: () => navigate("/user/rent", { state: { selectedDate } }), // นำทางไปยัง Rent เมื่อกด OK
      onCancel: () => navigate("/user/booked"), // นำทางไปยัง Booked เมื่อกด Cancel
    });
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90vh', textAlign: 'center' }} >
        <div style={{ marginTop: '60px' ,fontSize: '50px'}} >TICKET</div>
        <div style={{ padding: '40px' }} ><Calendar onSelectDate={(date) => setSelectedDate(date)} /></div>
        <Divider style={{ width: '80vw', borderBottom: '1px solid #b3b6b7' }} />
        <div style={{ display: 'flex', padding: '20px', justifyContent: 'space-between', alignItems: 'center', width: '75%' }}>
          <div style={{ fontSize: '30px' }} >Child </div>
          <div style={{ fontSize: '20px' }} >age 6-15 </div>
          <div style={{ fontSize: '30px' }} >฿30</div>
          <Counter />
        </div>
        <Divider style={{ width: '80vw', borderBottom: '1px solid #b3b6b7' }} />
        <div style={{ display: 'flex', padding: '20px', justifyContent: 'space-between', alignItems: 'center', width: '75%' }}>
          <div style={{ fontSize: '30px' }} >Adult </div>
          <div style={{ fontSize: '20px' }} >age 16-60 </div>
          <div style={{ fontSize: '30px' }} >฿50</div>
          <Counter />
        </div>
        <Divider style={{ width: '80vw', borderBottom: '1px solid #b3b6b7' }} />
        <div style={{ display: 'flex', padding: '20px', justifyContent: 'space-between', alignItems: 'center', width: '75%' }}>
          <div style={{ fontSize: '30px' }} >Other </div>
          <div style={{ fontSize: '20px' }} >age 0-5 and 60+ </div>
          <div style={{ fontSize: '30px' }} >FREE</div>
          <Counter />
        </div>
        <Divider style={{ width: '80vw', borderBottom: '1px solid #b3b6b7' }} />
      </div>
          <div style={{ position: "fixed", bottom: "5%", right: "50px"}}>
          <Button 
            onClick={confirm}
            style={{
              backgroundColor: '#B25900',
              borderColor: '#B25900', 
              color: '#fdfefe', 
              fontSize: '25px',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              height: '50px',
              width: '150px'
            }} >
              Next
          </Button>
        </div>
        {contextHolder}
    </>
  );
};

export default Ticket;