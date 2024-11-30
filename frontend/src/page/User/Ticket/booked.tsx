import React from 'react'
import { Button, Modal, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const Booked = () => {
  const [modal, contextHolder] = Modal.useModal();

  const paid = () => {
    modal.confirm({
      title: 'การจองสำเร็จ',
      //icon: <ExclamationCircleOutlined />,
      content: 'Bla bla ...',
      okText: <Link to="/">Confirm</Link>,
      cancelText: 'Cancel',
    });
  };

  const deleteticket = () => {
    modal.confirm({
      title: 'ยืนยันการลบ',
      //icon: <ExclamationCircleOutlined />,
      okText: 'Confirm',
      cancelText: 'Cancel',
    });
  };

  return (
    <>
    Booked
      <Space>
        <div style={{ position: "fixed", bottom: "5%", right: "50px"}}><Button onClick={paid}>Payment</Button></div>
        <div style={{ position: "fixed", bottom: "5%", left: "50px"}}>
          <Button onClick={deleteticket} icon={<DeleteOutlined />} danger shape="circle" 
          style={{
            padding: 0, // กำหนด padding เป็น 0 เพื่อให้ปุ่มมีขนาดเล็ก
            width: '40px', // กำหนดความกว้างของปุ่ม
            height: '40px', // กำหนดความสูงของปุ่ม
          }} /></div>
      </Space>
      {contextHolder}
    </>
  );
}

export default Booked;
