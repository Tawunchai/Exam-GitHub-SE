import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { Modal, Button, Card, Col, DatePicker, Form, Input, InputNumber, Select, Row, message, Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Icon, { CameraTwoTone } from '@ant-design/icons';
import {QRCode} from 'antd';
import generatePayload from 'promptpay-qr';
import {SearchProductSale, AddSaleProduct} from "../../services/https/aut/http";
import {SaleProductListIF} from "../../interface/SaleProductListIF"
import LogoZooManage from '../../assets/LogoZooManage.png';
import thaiqrpayment from '../../assets/thaiqrpayment.png'
import '../../custom.css';

import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';

const { Search } = Input;
function SaleProduct() {
// Initial State และ Hook
const [DataSaleProduct, setDataSaleProduct] = useState<any>(null); // ข้อมูลสินค้าปัจจุบัน
const [ModelSearchBarcode, ChangeStateModelSearchBarcode] = useState(false); // เปิด/ปิด popup สินค้าที่สแกน/ค้นหาด้วย Barcode
const savedProductList = localStorage.getItem("ProductSaleList");  //อ่านค่า localStorage
const initialProductList = savedProductList ? JSON.parse(savedProductList) : [];//เช็คว่ามี savedProductList ไหม
const [ProductSaleList, SetProductSaleList] = useState<SaleProductListIF[]>(initialProductList); // รายการสินค้าทั้งหมด
const [totalPrice, setTotalPrice] = useState(0);

const [ModelQRCodePayment, StateModelQRCodePayment] = useState(false); //เปิดปิดโมเดล QR CODE สแกนจ่าย
const [phoneNumber, setPhoneNumber] = useState<string>('0644044078');

const [qrCode, setQrCode] = useState<string>('');

const [ModelConfirmPayment, StateModelConfirmPayment] = useState(false);//โมเดลยืนยันการชำระเงิน

const [ModelScanProductSale, StateModelScanProductSale] = useState(false); //ตัวเปิดปิด  โมเดลสแกน
const [ResaultScan, setResaultScan] = useState<string>('');//สแกน
const [OnOffScan, setOnOffScan] = useState(true); // สถานะการสแกน

const handleQR = () => {
  setQrCode(generatePayload(phoneNumber, { amount: totalPrice })); // เปลี่ยน String(totalPrice) เป็น totalPrice
};


const ColumnsReceiveProduct = [
  {
    title: 'Image',
    dataIndex: 'Path',
    key: 'Path',
    render: (Path: string) => (
      <img
        src={Path} // ใช้ Base64 string
        alt="product"
        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
      />
    ),
  },
  {
    title: 'ชื่อ',
    dataIndex: 'Name',
    key: 'Name',
  },
  {
    title: 'Barcode',
    dataIndex: 'Barcode',
    key: 'Barcode',
  },
  {
    title: 'ราคา',
    dataIndex: 'Price',
    key: 'Price',
  },
  {
    title: 'จำนวนที่ซื้อ',
    dataIndex: 'quantitySale',
    key: 'quantitySale',
  },
  {
    title: 'จัดการ',
    dataIndex: 'Barcode',
    key: 'actions',
    render: (Barcode: string) => (
      <div>
        <Button
          type="primary"
          style={{ marginLeft: '10px' }}
          //onClick={() => searchProductReceive(Barcode)} // เรียกฟังก์ชันแก้ไขเมื่อคลิก
        >
          แก้ไข
        </Button>
      </div>
    ),
  },
];


const webcamRef = useRef<Webcam>(null);//กล้อง
const codeReader = new BrowserMultiFormatReader();//เป็นออบเจคไว้อ่าน QR Bar code
  
const capture = useCallback(async () => {
  if (OnOffScan && webcamRef.current) {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const result = await codeReader.decodeFromImageUrl(imageSrc);
        setResaultScan(result.getText()); // สิ่งที่อ่านได้จากการสแกน
      } catch (err) {
        console.error("Error decoding barcode: ", err);
      }
    }
  }
}, [webcamRef, codeReader, OnOffScan]);

useEffect(() => {
    const interval = setInterval(() => {
      capture();
    }, 800); 
    return () => clearInterval(interval);
}, [capture]);


useEffect(() => {
  if (ResaultScan !== '' && OnOffScan) {
    StateModelScanProductSale(false); // ปิด ModelOldProductScan
    searchProductSale(ResaultScan);
    ChangeStateModelSearchBarcode(true);  // เปิด ModelSearchBarcode
    setOnOffScan(false); // หยุดการสแกนหลังจากมีผลการสแกน
    setResaultScan(''); // เซ็ต ResaultScan เป็น null
  }
}, [ResaultScan]);



  const ClearListSaleProduct = () => {
    localStorage.removeItem('ProductSaleList');
    SetProductSaleList([]);
  };

  const searchProductSale = async (barcode: string) => {
    if (barcode.trim() !== '') {  // ตรวจสอบว่า value ไม่ว่าง
      console.log("ก่อนกดค้นหาด้วยBarcode", barcode);
      let res = await SearchProductSale(barcode);
      console.log("หลังกดค้นหาด้วยBarcode", res);  //แสดงError ได้
      setDataSaleProduct(res);
      ChangeStateModelSearchBarcode(true);
      
    }
  }

  const ClickAddToProductSaleList = (productsale: any) => {
    // ปิด popup การค้นหา (ถ้าจำเป็น)
    ChangeStateModelSearchBarcode(false);
  
    // สร้างข้อมูลใหม่ที่รวมข้อมูลสินค้าปัจจุบัน
    const dataSaveProductSale = {
      ...DataSaleProduct,
      quantitySale: productsale.quantitySale, // เพิ่ม quantitySale จาก productsale
    };
  
    console.log("ClickAddToProductSaleList", dataSaveProductSale);
  
    // อัปเดต ProductSaleList
    SetProductSaleList((prevList) => {   //product ในฟังก์ชัน map() มาจาก prevList ซึ่งเป็น array ของสินค้าใน ProductSaleList
      // ตรวจสอบว่า ID ซ้ำหรือไม่
      const updatedList = prevList.map((product) => {   //เอา prevList มา .map   product เป็นตัวแทน ข้อมูล รายการของ  ProductSaleList
        if (product.ID === dataSaveProductSale.ID) {  //product.ID คือ   ProductSaleList.ID
          // ถ้า ID ซ้ำ อัปเดต quantitySale  //ให้เป็นราคา ล่าสุด
          return { ...product, quantitySale: dataSaveProductSale.quantitySale };
        }
        return product; // ถ้าไม่ซ้ำ ให้คืนค่ารายการเดิม
      });
  
      // ถ้า ID ไม่ซ้ำเลย ให้เพิ่มข้อมูลใหม่เข้าไปในลิสต์
      if (!updatedList.some((product) => product.ID === dataSaveProductSale.ID)) {
        updatedList.push(dataSaveProductSale);
      }
  
      // เก็บข้อมูลใหม่ใน localStorage
      localStorage.setItem("ProductSaleList", JSON.stringify(updatedList));
      console.log("Updated Product List:", updatedList);
  
      return updatedList; // คืนค่า state ที่อัปเดต
    });
  };

  const clickConfirmSaleProduct = async () => {
    // กรองข้อมูลจาก ProductSaleList เพื่อให้ได้เฉพาะ ID, Name, Piece, Price, quantitySale
    const filteredProductSaleList = ProductSaleList.map(product => ({
      ID: product.ID,
      Name: product.Name,
      //Piece: product.Piece,
      Price: product.Price,
      quantitySale: product.quantitySale,
    }));
  
    const roundedPrice = Math.floor(totalPrice * 100) / 100;
  
    // ดึงข้อมูลจาก localStorage
    const employeeId = Number(localStorage.getItem('employeeid'));
  
    // สร้างออบเจ็กต์รวมข้อมูล
    const saleDataProduct = {
      ProductSaleList: filteredProductSaleList,
      totalPrice: roundedPrice,
      employeeId: employeeId,
      typepayment: "QRCode Payment",
    };
  
    // log สำหรับตรวจสอบ
    console.log("ข้อมูลการขายทั้งหมด:", saleDataProduct);
    let result = await AddSaleProduct(saleDataProduct);
    if(result.status === 200){
      StateModelQRCodePayment(false);
      StateModelConfirmPayment(false);
      
    }
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = ProductSaleList.reduce((sum, product) => {   //reduce: ใช้เพื่อลูปรวมค่าในอาร์เรย์  //sum: เป็นตัวแปรที่เก็บผลลัพธ์สะสมจากการคำนวณในแต่ละรอบ
        return sum + (product.quantitySale * product.Price); // เอาตัวแปร sum มาบวกวนซ้ำแต่ล่ะรอบ
      }, 0);  //ซึ่งจะเริ่มต้นด้วยค่าที่เรากำหนดใน reduce (ในกรณีนี้คือ 0)
       // ตัดทศนิยมส่วนเกินออกให้เหลือ 2 ตำแหน่ง
      const truncatedTotal = Math.trunc(total * 100) / 100;

      // แปลงให้เป็นสตริง และเติม 0 หากเป็นทศนิยม 1 ตำแหน่ง
      //const formattedTotal = truncatedTotal.toFixed(2);
      setTotalPrice(truncatedTotal);
    };
    calculateTotalPrice();
  }, [ProductSaleList]); // ทำงานเมื่อ ProductSaleList เปลี่ยนแปลง
  

  return (
    <div>
      <Modal width={800} open={ModelSearchBarcode} onCancel={() => ChangeStateModelSearchBarcode(false)} footer={null} >
        <Form name='DataSearchProductSale' onFinish={ClickAddToProductSaleList} autoComplete="off">
        {DataSaleProduct && (
        <div>
          {/* แสดงรายละเอียดของสินค้า */}
          <h2>Name Product = <i>{DataSaleProduct.Name}</i></h2>
          <h2>Barcode = <i>{DataSaleProduct.Barcode}</i></h2>
          <Form.Item initialValue={1} label="จำนวน" name="quantitySale" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
            <InputNumber min={1} max={Number(DataSaleProduct.Piece)} style={{ width: "100%" }} />
          </Form.Item>
          
          {/* แสดงรูปภาพ */}
          <img
              src={DataSaleProduct.Path}
              alt={DataSaleProduct.Name}
              style={{ height: "200px", width: "200px" }}
            />
          <Button type="primary" htmlType="submit" style={{fontWeight: "bold", color: "#3c312b", backgroundColor: "#F7B22C", width: "100px", height: "38px", margin: "20px 20px 0px 20px"}}>
            ADD
          </Button>

          <Button type="primary" onClick={() => ChangeStateModelSearchBarcode(false)} style={{fontWeight: "bold", color: "#3c312b", backgroundColor: "#FF6F00", width: "100px", height: "38px", margin: "20px 20px 0px 20px"}}>
            CANCEL
          </Button>
    
        </div>
          )}
        </Form>
      </Modal>
      {/*Modal แสดงหน้า QRcode ชำระเงิน*/}
      <Modal 
          width={1000} 
          open={ModelQRCodePayment} 
          onCancel={() => StateModelQRCodePayment(false)} 
          footer={null}
        >
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}>
        <img 
          style={{ width: '450px', marginBottom: '20px' }} 
          src={thaiqrpayment} 
          alt="payment" 
        />
        <QRCode 
          type="svg" 
          errorLevel="H" 
          value={qrCode} 
          icon={LogoZooManage} 
          style={{ marginTop: '-35px',width: '440px', height: '440px' }} 
        />
        <></>
        <h1>ยอดที่ต้องชำระ<span style={{marginLeft: '20px', color: 'blue', fontSize: '45px'}}>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalPrice)}</span><span style={{marginLeft: '20px'}}>บาท</span></h1>
        <Button onClick={() => StateModelConfirmPayment(true)} type="primary" shape="default" style={{backgroundColor: '#f6a450', width: '250px', height: '50px' }}>
          <p style={{ color: 'white', fontSize: '30px'}}>ยืนยันการชำระเงิน</p>
        </Button> 
      </div>
    </Modal>

    {/* Model กล้องสแกนบาร์โค้ด */}
    <Modal width={940} title={null} open={ModelScanProductSale} onCancel={() => {StateModelScanProductSale(false); setOnOffScan(false);}} footer={null} style={{ borderRadius: '12px', }}>
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'environment' }}
          width={900}
          height={500}
        />
        {/* {scannedCode && ( */}
          <div>
            <h2>Scanned Code: {ResaultScan}</h2>
          </div>
        {/* )} */}
      </div>
    </Modal>
    

    <Modal width={940} title={null} open={ModelConfirmPayment}  onOk={() => clickConfirmSaleProduct()} onCancel={() => StateModelConfirmPayment(false)}  style={{ borderRadius: '12px', }}>
      <h2>ยืนยันการรับสินค้า</h2>
    </Modal>


      <span>
        <Search  onSearch={searchProductSale}  allowClear placeholder="Search Barcode"  enterButton="ค้นหา" size="large" style={{ width: "600px", marginLeft: "500px", marginTop: '8px'}}/>
        {/* ปุ่มเปิดกล้อง */}
        <span onClick={() => StateModelScanProductSale(true)} ><CameraTwoTone style={{ fontSize: '45px', marginTop: '5px', marginLeft: '20px'}} /></span>
      </span>
      <Table rowKey="ID" dataSource={ProductSaleList} columns={ColumnsReceiveProduct} pagination={false} style={{ marginTop: '20px' }} />
      <h1>ราคารวม = {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalPrice)}</h1>
      {/* ปุ่ม ล้างรายการสินค้า */}
      <Button type="primary" style={{ margin: '30px ' , width: '100px'}} onClick={() => ClearListSaleProduct()} >
        ล้าง
      </Button>

      <Button type="primary" shape="default" style={{ marginLeft: '50px', backgroundColor: 'pink', width: '300px', height: '55px' }}>
        <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>เงินสด</p>
      </Button> 

      <Button onClick={() => {StateModelQRCodePayment(true);  handleQR(); }} type="primary" shape="default" style={{ marginLeft: '50px', backgroundColor: 'green', width: '300px', height: '55px' }}>
          <p style={{ color: 'black', fontSize: '40px', margin: 0 }}>โอนจ่าย</p>
      </Button> 

    </div>
  );

}
  
export default SaleProduct;
  