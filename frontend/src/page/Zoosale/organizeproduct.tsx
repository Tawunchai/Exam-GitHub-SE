import { Upload, Button, Image, Modal, Input, Form, message, InputNumber, Card, Row, Col, Select} from 'antd';
import { Space, Table, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import type { TableProps, TableColumnsType } from 'antd';
import {GetProductForOrganize, AddShelfZone, GetAllShelfZone, AddProductToShelfZone} from "../../services/https/aut/http";
import {ShelfZoneIF} from "../../interface/ShelfZone"
import { Barcode } from 'lucide-react';
import JsBarcode from 'jsbarcode';
const { Option } = Select;
function Organizeproduct() {
  const [form] = Form.useForm();

  const [ProductOrganize, setProductOrganize] = useState([]);

  const [ModelShelfZone, ChangeStateModelShelfZone] = useState(false);

  const [ModelOganizeProductByID, StateModelOganizeProductByID] = useState(false); //popup จัดสินค้าเข้าชั้นวาง
  const [dataOganizeProductByID, setOganizeProductByID] = useState<any>(null);//ข้อมูลสินค้า

  const [DataShelfZone, setDataShelfZone] = useState<ShelfZoneIF[]>([]);;

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
      title: 'การจัดการ',
      key: 'actions',
      render: (keyid) => (   //render: (keyid)  ตรง keyid  เป็นชื่ออะไรก็ได้ คือข้อมูลทั้งหมดของตารางนี้
        <>
        <Button onClick={() => organizeProductByID(keyid)} type="primary" shape="default" style={{backgroundColor: 'green', width: '120px', height: '40px' }}>
            <p style={{ color: 'black', fontSize: '20px', margin: 0 }}>จัดสินค้า</p>
        </Button> 
        </>
      ),
    },
  ];

  const organizeProductByID = async (keyid: any) => {   //ใช้การดึงรูป และข้อมูลจากตัวตารางเลยไม่ต้องดึงผ่าน Backend อีก
    console.log('ก่อน set organizeProductByID', keyid);
    setOganizeProductByID(keyid);
    getallShelfZone();
    StateModelOganizeProductByID(true);
  };

  useEffect(() => {      //เรียกใช้เมื่อ(โหลดครั้งแรก)
    console.log('หลัง set dataOganizeProductByID:', dataOganizeProductByID);
  }, [dataOganizeProductByID]);   //หากค่าในอาร์เรย์ [] เปลี่ยนแปลง useEffect จะทำงานอีกครั้ง

  const getallShelfZone = async () => {
    let res = await GetAllShelfZone();
    console.log('GetAllShelfZone',res);
    setDataShelfZone(res);
  };

  const ClickAddShelfZone = async (shelfzone: any) => {
    console.log("ก่อนAddShelfZone", shelfzone);
    let res = await AddShelfZone(shelfzone);  // คุณจะต้องเรียกใช้ฟังก์ชันนี้ในที่อื่นเพื่อทำการยิง API
    console.log("หลังAddShelfZone", res);
  };


  const ClickAddProductToShelfZone = async (data: any) => {
    console.log('ก่อนส่ง AddProductToShelfZone', data);
  
    // สร้าง modal container
    const modalContainer = document.createElement('dialog');
    modalContainer.style.width = '400px';
    modalContainer.style.border = '1px solid #ccc';
    modalContainer.style.padding = '20px';
    modalContainer.style.borderRadius = '8px';
    modalContainer.style.textAlign = 'center';
    modalContainer.innerHTML = `
      <style>
        @media print {
          #printButton, #cancelButton {
            display: none; /* ซ่อนปุ่มในโหมดพิมพ์ */
          }
        }
      </style>
      <div class="label">
        <h3>${data.productName}</h3>
        <p>ราคา: ${data.priceproduct.toFixed(2)} บาท</p>
        <canvas id="barcode"></canvas>
        <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
          <button id="printButton" style="padding: 10px 20px; background: #007BFF; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
            พิมพ์
          </button>
          <button id="cancelButton" style="padding: 10px 20px; background: #FF4B4B; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
            ยกเลิก
          </button>
        </div>
      </div>
    `;
  
    // เพิ่ม modal ไปยัง body
    document.body.appendChild(modalContainer);
  
    // สร้างบาร์โค้ด
    const barcodeCanvas = modalContainer.querySelector('#barcode') as HTMLCanvasElement;
    JsBarcode(barcodeCanvas, data.BarcodeProduct, {
      format: 'CODE128',
      displayValue: true,
    });
  
    // เพิ่ม event ให้ปุ่มพิมพ์
    const printButton = modalContainer.querySelector('#printButton') as HTMLButtonElement;
    printButton.onclick = () => {
      modalContainer.setAttribute('style', 'display: block;'); // แก้ปัญหาไม่พิมพ์ modal
      window.print();
    };
  
    // เพิ่ม event ให้ปุ่มยกเลิก
    const cancelButton = modalContainer.querySelector('#cancelButton') as HTMLButtonElement;
    cancelButton.onclick = () => {
      modalContainer.close();
      modalContainer.remove();
    };
  
    // แสดง modal
    modalContainer.showModal();
    
    let res = await AddProductToShelfZone(data);
    console.log('AddProductToShelfZone', res);
    if (!res.ok) {
      const responseData = await res.json();
      console.log('ตอบกลับจาก Backend-->>', responseData.message);  //อ่านerror backend
    }
  };


  const getProductForOrganize = async () => {
    let res = await GetProductForOrganize();
    console.log('getProductForOrganize',res);
    setProductOrganize(res);
  };

  useEffect(() => {
    getProductForOrganize(); 
  }, []);

    return (
      <div>
        <Modal width={800} open={ModelShelfZone} onCancel={() => ChangeStateModelShelfZone(false)} footer={null} >
          <Form name='DataFormShelfZone' onFinish={ClickAddShelfZone} autoComplete="off">
            <Form.Item  label="Zonename" name="Zonename" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item  label="Location" name="Location" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
              <Input style={{ width: "100%" }} />
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{fontWeight: "bold", backgroundColor: "#3c312b", width: "100px",height: "38px", color: "white"}}>
              Add
            </Button>
          </Form>
        </Modal>

        <Modal width={800} open={ModelOganizeProductByID} onCancel={() => {StateModelOganizeProductByID(false); form.resetFields();}} footer={null} >
        {dataOganizeProductByID && (
          <div>
            <h1 style={{font: '60px'}} >จัดสินค้าเข้าชั้นวาง</h1>
            <img
                src={`http://localhost:8000/${dataOganizeProductByID.Path}`}
                alt={dataOganizeProductByID.Name}
                style={{ height: "200px", width: "200px" }}
              />
              <Form name='DataOganizeProduct' autoComplete="off" form={form}  onFinish={(values) => ClickAddProductToShelfZone({ ...values, productID: dataOganizeProductByID.ID, productName: dataOganizeProductByID.Name, BarcodeProduct:  dataOganizeProductByID.Barcode})} >
                 <h1 style={{font: '60px'}} >{dataOganizeProductByID.Name}</h1>

                <Form.Item    label="ราคา" name="priceproduct" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                  <InputNumber  min={1}  style={{ width: "100%" }} />
                </Form.Item>
                
                <Form.Item   label="ชั้นวาง" name="ShelfID" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
                    <Select  style={{width: "200px", height: "40px"}}>      
                        {DataShelfZone.map(Shelf => (
                        <Option key={Shelf.ID}>{Shelf.Zonename}</Option>))}
                        {/* ตัวKeyตรง option จะเป็นตัวส่ง Data ไป*/}
                    </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit" style={{fontWeight: "bold", backgroundColor: "#3c312b", width: "100px",height: "38px", color: "white"}}>
                  Add
                </Button>

              </Form>
          </div>
            )}
        </Modal>

          <h1 style={{fontSize: "30px"}}>organizeproduct</h1>  
          <Button onClick={() => ChangeStateModelShelfZone(true)} type="primary" shape="default" style={{backgroundColor: 'pink', width: '200px', height: '40px' }}>
              <p style={{ color: 'black', fontSize: '20px', margin: 0 }}>ManageShelfZone</p>
          </Button> 
          <Table columns={columns} dataSource={ProductOrganize} rowKey="ID" scroll={{ y: 540 }} pagination={false}/>
      </div>
    );
  }
  
  export default Organizeproduct;
  