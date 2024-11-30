import React, { useState, useEffect } from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps, TableColumnsType } from 'antd';
import { Upload, Button, Image, Modal, Input, Form, message, InputNumber, Card, Row, Col} from 'antd';
import ImgCrop from 'antd-img-crop';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {getAllProductStock, GetDataEmployeeByID } from "../../services/https/aut/http";

const { Search } = Input;



function ZooShop() {
  // console.log("token_type", localStorage.getItem("token_type")); 
  // console.log("token", localStorage.getItem("token"));
  // console.log("roleid", localStorage.getItem("roleid"));
  // console.log("roleName", localStorage.getItem("roleName"));
  
  const [dataProduct, setDataProduct] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลสินค้า

  const [ModelEditProduct, StateModelEditProduct] = useState(false);

  const columns: TableColumnsType = [
    { 
      title: 'Image', 
      key: 'ID',
      dataIndex: 'Path', // ดึงค่า Path จากข้อมูล
      render: (path: string) => (
        <Image 
          width={90}
          src={`http://localhost:8000/${path}`} // ใช้ path ที่ดึงมาจากฐานข้อมูล
          alt="ProductImage"
        />
      ),
    },
    { title: 'Product Name', dataIndex: 'Name', key: 'productname' },
    { title: 'Price', dataIndex: 'Price', key: 'price' },
    { title: 'Piece', dataIndex: 'Piece', key: 'piece' },
    { title: 'Barcode', dataIndex: 'Barcode', key: 'Barcode' },
    {
      title: 'ShelfZone', 
      dataIndex: 'ShelfZone', 
      key: 'ShelfZone', 
      render: (shelfZone: any) => shelfZone ? shelfZone.Zonename : 'No ShelfZone',  // ตรวจสอบก่อนเข้าถึง
    },
    {
      title: 'การจัดการ',
      key: 'actions',
      render: (ID) => (
        <>
          <Button
            onClick={() => StateModelEditProduct(true)}   
            shape="circle"
            icon={<EditOutlined />}
            size={"large"}   //ปุ่มแก้ไข
          />
          <Button
            //onClick={() => showModal(record)}
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}  //ปุ่มลบ
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];
  
  const getAllProductStocks = async () => {
    let res = await getAllProductStock();
    console.log('getAllProductStock',res);
    setDataProduct(res);
  };

  const getDataEmployeeByID = async () => {
    const userid = localStorage.getItem('userid');
    let res = await GetDataEmployeeByID(userid);
    localStorage.setItem('employeeid', res.ID);
    console.log('employeeid', localStorage.getItem('employeeid'));
  };

  useEffect(() => {
    getAllProductStocks(); 
    getDataEmployeeByID();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('isLogin');
    localStorage.removeItem('roleName');
    localStorage.removeItem('userid');
    localStorage.removeItem('firstnameuser');
    localStorage.removeItem('lastnameuser');
    window.location.href = "/login"; 
  };

  return (
    <div style={{backgroundColor: "#F5F6FA"}}>
          {/* สินค้าใหม่ */}
    <Modal width={800} open={ModelEditProduct} onCancel={() => StateModelEditProduct(false)} footer={null} >

    </Modal>
      <nav style={{ height: '50px', backgroundColor: "white", color: "black", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Row gutter={24} style={{ width: "100%"}}>
        <Col span={4}></Col>
          <Col span={12}>
            <Search allowClear placeholder="Search Name Product"  enterButton="Search" size="large" style={{ width: "430px", marginLeft: "400px", marginTop: '7px'}}/>
          </Col>
          <Col span={8}>
            <div style={{marginLeft: '400px'}}>
              <b style={{fontSize: '18px', marginTop: '2px'}}> <span style={{marginRight: '5px'}}> {localStorage.getItem('firstnameuser')} </span> {localStorage.getItem('lastnameuser')} </b>
              <p style={{fontSize: '15px', marginTop: '4px'}}>{localStorage.getItem('roleName')}</p>
            </div>
          </Col>
        </Row>
      </nav>

      <Card style={{ width: '1800px', height: '640px', marginTop: '10px', marginLeft: '40px' }} 
        title={<span style={{ fontSize: '35px', fontFamily: 'Kanit, sans-serif' }}>Product Stock</span>}>
        <Table columns={columns} dataSource={dataProduct} rowKey="ID" scroll={{ y: 540 }} pagination={false}/>
      </Card>

      <Link to="/" onClick={handleLogout}>
        <Button  type="primary"  shape="default" style={{ marginTop: '50px', backgroundColor: '#f7b22c', width: '300px', height: '55px' }}>
          <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>LOG OUT</p>
        </Button> 
      </Link> 

      <Link to="saleproduct">
        <Button  type="primary"  shape="default" style={{ marginLeft: '50px', backgroundColor: 'green', width: '300px', height: '55px' }}>
          <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>ขายสินค้า</p>
        </Button> 
      </Link> 
      
      <Link to="receiveproduct" >
        <Button type="primary" shape="default" style={{ marginLeft: '50px', backgroundColor: 'pink', width: '300px', height: '55px' }}>
          <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>รับสินค้า</p>
        </Button> 
      </Link> 

      <Link to="organizeproduct" >
        <Button type="primary" shape="default" style={{ marginLeft: '50px', backgroundColor: 'gray', width: '300px', height: '55px' }}>
            <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>จัดสินค้า</p>
        </Button> 
      </Link>
    </div>
  );
}
export default ZooShop;