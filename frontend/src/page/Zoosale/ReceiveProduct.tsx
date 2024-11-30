import React, { useState, useEffect, useRef, useCallback  } from 'react';
import type { UploadFile } from 'antd/es/upload/interface';
import { Upload, Button, Image, Modal, Input, Form, message, InputNumber, Card, Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import ImgCrop from 'antd-img-crop';
import { SearchProductReceive, AddReceiveProduct} from "../../services/https/aut/http";
import {ReceiveProductListIF} from "../../interface/ReceiveProductListIF"

import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';


const { Search } = Input;

function ReceiveProduct() {  /**........ds45ds45ds454ds...*/
  //ไว้เก็บค่าลิสสินค่าที่รับมา
  const savedProductList = localStorage.getItem('ReceiveProductList');
  const initialProductList = savedProductList ? JSON.parse(savedProductList) : [];

  //ใช้การบันทึกรูปใน ลิสก่อน
  const [fileList, setFileList] = useState<UploadFile[]>([]); //ไฟล์ลิสตั้งไว้เพราะอาจมีการลบไฟล์  อัพใหม่ก็ได้
  const [editFileList, setEditFileList] = useState<UploadFile[]>([]); // สำหรับการแก้ไขรูปภาพในแถว
  const [fileEdit, setFileEdit] = useState<File | null>(null); 
  const [file, setFile] = useState<File | null>(null);      //ไว้เป็นไฟล์ที่จะอัพโหลด
  const [previewImage, setPreviewImage] = useState<string>(''); 
  const [previewOpen, setPreviewOpen] = useState<boolean>(false); 
  const [ModelAddNewProduct, ChangeStateModelNewProduct] = useState(false); //pop up กรอกข้อมูลสินค้าใหม่

  //กดค้นหาสินค้าแล้วแสดง pop up หากมีข้อมูลที่ตรงกับ database
  const [ModelSearchBarcode, ChangeStateModelSearchBarcode] = useState(false); //popup กรอกข้อมูล
  const [searchBarcodeProduct, setSearchBarcodeProduct] = useState<any>(null);//data ข้อมูลสินค้าชิ้นที่ค้นหา

  const [ModelOldProductScan, ChangeStateModelOldProductScan] = useState(false);//ตัเปิดปิดโมเดลสแกนบาร์โค้ด
  const [ResaultScan, setResaultScan] = useState<string>('');//สแกน
  const [OnOffScan, setOnOffScan] = useState(true); // สถานะการสแกน

  //แสดงรายการสินค้าที่รับมา
  const [ReceiveProductList, SetReceiveProductList] = useState<ReceiveProductListIF[]>(initialProductList);//ข้อมูลสินค้าทั้งหมด  ถ้ารีหน้า ReceiveProductList จะหาย เอา initialProductList มาช่วยเซ้ตค่าเดิมให้กลับมา

  const [ModelConfirmProduct, ChangeStateModelConfirmProduct] = useState(false);//โมเดลยืนยันการรับสินค้า ที่บันทึกลิส

  const [PriceReceiving, SetPriceReceiving] = useState<number>(0);//ยอดรวมราคาสินค้า

  const [editingID, setEditingID] = useState<string | null>(null); //เก็บ ID สินค้า กดแก้ไข
  const [editingProduct, setEditingProduct] = useState<ReceiveProductListIF | null>(null);//เก็บข้อมูลสินค้า ที่กดแก้ไข

  const handleEdit = (product: ReceiveProductListIF) => {
    console.log("ClickEdit:" , product);      //แสดงชื่อ สินค้าที่คลิก
    setEditingID(product.ID);
    setEditingProduct(product); // เก็บข้อมูลของสินค้า ที่คลิก
  };

  const saveEditedProduct = () => {
    if (editingProduct) {
      SetReceiveProductList((prevList) => {
        const updatedList = prevList.map((product) =>
          product.ID === editingProduct.ID ? editingProduct : product
        );
        localStorage.setItem('ReceiveProductList', JSON.stringify(updatedList));
        return updatedList;
      });
      setEditingID(null);
      setEditingProduct(null);
    }
 };
 

  const handleImageEdit = (info: { fileList: UploadFile[] }) => {
    // จำกัดให้แสดงไฟล์ใน fileList มีแค่ 1 รูป
    setEditFileList(info.fileList.slice(0, 1)); 

    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj as File;
      //setFileEdit(file);

      // แปลงไฟล์ใหม่เป็น Base64 URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setEditingProduct((prev) => prev && { ...prev, Path: base64Image });
      };
      reader.readAsDataURL(file); // แปลงไฟล์เป็น Base64
    } else {
      //setFileEdit(null);
      setEditingProduct((prev) => prev && { ...prev, Path: '' });
    }
  };

  const handleDeleteProduct = (product: ReceiveProductListIF) => {
    // ลบสินค้าออกจากรายการ
    SetReceiveProductList((prevList) => {
      const updatedList = prevList.filter((item) => item.ID !== product.ID);  //กรองเอาที่ ID ที่ไม่ใช่กับที่ลบเก็บไว้
      localStorage.setItem('ReceiveProductList', JSON.stringify(updatedList));
      return updatedList;
    });
  };
  
 
  

  
  const generateNewProductID = () => {
    const now = new Date();
    const formattedDate = now.toISOString().replace(/[-:.TZ]/g, ''); // ลบตัวอักษรพิเศษทั้งหมดออก
    return `new-${formattedDate}`;
  };

  const ClickAddNewProduct = (dataProduct: any) => {
    if (!file) {
        console.error('ไม่มีไฟล์ถูกเลือก');
        return;
    }

    // ฟังก์ชันแปลงไฟล์เป็น Base64
    const reader = new FileReader();
    reader.onload = () => {
        const base64String = reader.result as string;

        // สร้างข้อมูลสินค้าใหม่
        const newProduct: ReceiveProductListIF = {
            ID: generateNewProductID(), // ใช้ generateID() เพื่อสร้าง ID ใหม่
            Path: base64String, // เก็บ Base64 ของรูปภาพ
            Name: dataProduct.nameproduct,
            Barcode: dataProduct.barcode,
            quantityReceive: dataProduct.pieceproduct,
        };

        // เพิ่มสินค้าใหม่เข้าไปในรายการ
        SetReceiveProductList((prevList) => {
            const updatedList: ReceiveProductListIF[] = [...prevList, newProduct];
            // เก็บรายการใน LocalStorage
            localStorage.setItem('ReceiveProductList', JSON.stringify(updatedList));
            console.log('เพิ่มสินค้าใหม่:', updatedList); // พิมพ์ค่าที่อัปเดตแล้ว
            return updatedList;
        });
        ChangeStateModelNewProduct(false);
    };

    // อ่านไฟล์ที่ผู้ใช้อัปโหลด
    reader.readAsDataURL(file);
  };


    
  const handleImageChange = (info: { fileList: UploadFile[] }) => {   // { fileList: UploadFile[] }  เป็นการกำหนดรูปแบบของข้อมูล 
                                //fileList: เป็นอาร์เรย์ (array) ที่มีประเภทเป็น UploadFile[] ซึ่งเป็นชนิดข้อมูลที่กำหนดไว้ใน Ant Design สำหรับการจัดการไฟล์ที่ถูกอัปโหลด
    setFileList(info.fileList);//เก็บไฟล์ไว้ในลิสก่อน
    if (info.fileList.length > 0) {
        setFile(info.fileList[0].originFileObj as File);  //info.fileList[0] หมายถึงการเลือก ไฟล์ล่าสุด ผู้ใช้สามารถอัปโหลดได้เพียง 1 รูป ซึ่ง info.fileList จะมีไฟล์ที่ถูกเลือกอยู่ในตำแหน่งแรก (index 0) เสมอ
    } else {                                            // originFileObj as File เป็นการยืนยันกับ TypeScript ว่าเราทราบแน่นอนว่า originFileObj เป็นประเภท File
        setFile(null);  //ถ้าไม่มีรูปแสดงว่าลบไฟล์
    }
  };

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as File);
      reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(src);
    setPreviewOpen(true);
  };


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
      ChangeStateModelOldProductScan(false); // ปิด ModelOldProductScan
      searchProductReceive(ResaultScan);
      ChangeStateModelSearchBarcode(true);  // เปิด ModelSearchBarcode
      setOnOffScan(false); // หยุดการสแกนหลังจากมีผลการสแกน
      setResaultScan(''); // เซ็ต ResaultScan เป็น null
    }
  }, [ResaultScan]);


  const searchProductReceive = async (Product: string) => {
    if (Product.trim() !== '') {  // ตรวจสอบว่า value ไม่ว่าง
      console.log("ก่อนกดค้นหาด้วยBarcode", Product);
      let res = await SearchProductReceive(Product);
      console.log("หลังกดค้นหาด้วยBarcode", res);
      if(res){
        setSearchBarcodeProduct(res);
        ChangeStateModelSearchBarcode(true);
      }
      
    }
  }

    
    const AddListReceiveProduct = async () => {
      // สร้าง FormData
      const formData = new FormData();
      // เพิ่มข้อมูลสินค้าที่รับมาใน FormData
      ReceiveProductList.forEach((product: any, index: number) => {
        formData.append(`products[${index}][ID]`, product.ID);
        formData.append(`products[${index}][Barcode]`, product.Barcode);
        formData.append(`products[${index}][Name]`, product.Name);
        formData.append(`products[${index}][Path]`, product.Path);  // Base64 image หรือ Path ของไฟล์
        formData.append(`products[${index}][quantityReceive]`, product.quantityReceive.toString());
      });
    
      const employeeid = localStorage.getItem('employeeid');
      if (!employeeid) {
          console.error('employeeid not found in localStorage');
          return;
      }
      // เพิ่ม totalPrice
      formData.append('totalPrice', PriceReceiving.toString());
      formData.append('employeeid', employeeid.toString());
    
      // แสดงค่าของ formData ก่อนส่งไป API
      console.log("ข้อมูลที่ส่งไปใน FormData:");
      formData.forEach((value, key) => {
        console.log(key, value);
      });
    
      // ส่งข้อมูลไปยังฟังก์ชัน API (จากไฟล์อื่น)
      let res = await AddReceiveProduct(formData);  // คุณจะต้องเรียกใช้ฟังก์ชันนี้ในที่อื่นเพื่อทำการยิง API
      console.log("หลังรับสินค้า", res);
    };
    
    
    

    
    const ClickReceiveProduct = (values: any) => {
      ChangeStateModelSearchBarcode(false);
      // สร้างออบเจกต์ใหม่ที่รวม quantityReceive ไว้ใน searchBarcodeProduct
      const dataReceiveProduct = {
        ...searchBarcodeProduct,
        quantityReceive: values.quantityReceive, // ...คือเอาส่วนข้างในอีกชั้นมา
      };//เอาจำนวนที่กรอก  รวมกับข้อมูลสินค้า
    
      console.log("ClickReceiveProduct", dataReceiveProduct);
    
      SetReceiveProductList((prevList) => {
        // ตรวจสอบว่า ID ซ้ำหรือไม่
        const updatedList = prevList.map((product) => {
          if (product.ID === dataReceiveProduct.ID) {
            // ถ้า ID ซ้ำ ให้คืนค่าออบเจกต์ใหม่ที่อัปเดต quantityReceive
            return { ...product, quantityReceive: dataReceiveProduct.quantityReceive };
          }
          return product; // ถ้าไม่ซ้ำ ให้คืนค่ารายการเดิม
        });
    
        // ถ้า ID ไม่ซ้ำเลย ให้เพิ่มข้อมูลใหม่เข้าไปในลิสต์
        if (!updatedList.some(product => product.ID === dataReceiveProduct.ID)) {
          updatedList.push(dataReceiveProduct);
        }
    
        // เก็บข้อมูลใหม่ใน localStorage
        localStorage.setItem('ReceiveProductList', JSON.stringify(updatedList));
        console.log("สินค้าที่มีอยู่แล้ว", updatedList);
    
        return updatedList;
      });
    };
    

    const ClilkClearAllReceiveProduct = () => {
      localStorage.removeItem('ReceiveProductList');
      SetReceiveProductList([]);
    };
    
    const ColumnsReceiveProduct = [
      {
        title: 'Image',
        dataIndex: 'Path',
        key: 'Path',
        render: (Path: string, record: ReceiveProductListIF) => (
            editingID === record.ID ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={Path} // แสดงรูปเดิมหรือรูปใหม่ที่แก้ไข
                        alt="product"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                    />
                    <ImgCrop rotationSlider>
                        <Upload
                            listType="picture-card"
                            customRequest={({ onSuccess }) => { setTimeout(() => { onSuccess && onSuccess("ok"); }, 0); }}
                            fileList={editFileList}
                            onChange={handleImageEdit}
                            onPreview={handlePreview}
                            maxCount={1}
                        >
                            {editFileList.length < 1 && '+ Upload'/*เช็คความยาว editFileList เพื่อให้อัพโลดได้แค้1*/}
                        </Upload>
                    </ImgCrop>
                    {previewImage && (
                      <Image
                      wrapperStyle={{ display: 'none' }} 
                      preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) => !visible && setPreviewImage(''),
                      }}
                      src={previewImage}
                      />
                    )}
                    <p>รูปใหม่ที่จะอัพโหลด</p>
                </div>
            ) : (
                <img
                    src={Path}
                    alt="product"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
            )
        ),
    },     
      {
        title: 'ชื่อ',
        dataIndex: 'Name',
        key: 'Name',
        render: (Name: string, record: ReceiveProductListIF) => (
          editingID === record.ID ? (  //เช็ค ID ตรงกับ ID ที่คลิกแก้ไขไหม
            <Input
              type="text"
              value={editingProduct?.Name || ''}
              onChange={(e) =>
                setEditingProduct((prev) => prev && { ...prev, Name: e.target.value })
              }
            />
          ) : (
            Name
          )
        ),
      },
      {
        title: 'Barcode',
        dataIndex: 'Barcode',
        key: 'Barcode',
        render: (Barcode: string, record: ReceiveProductListIF) => (
          editingID === record.ID ? (
            <Input
              type="text"
              value={editingProduct?.Barcode || ''}
              onChange={(e) =>
                setEditingProduct((prev) => prev && { ...prev, Barcode: e.target.value })
              }
            />
          ) : (
            Barcode
          )
        ),
      },
      {
        title: 'จำนวนที่รับ',
        dataIndex: 'quantityReceive',
        key: 'quantityReceive',
        render: (quantity: number, record: ReceiveProductListIF) => (
          editingID === record.ID ? (
            <InputNumber
              min={1}
              type="number"
              value={editingProduct?.quantityReceive || 0} // ใช้ 0 แทนค่าว่าง
              onChange={(value) =>
                setEditingProduct((prev) =>
                  prev
                    ? {
                        ...prev,
                        quantityReceive: value ?? 0, // ใช้ 0 ถ้า value เป็น null หรือ undefined
                      }
                    : null
                )
              }
            />
          ) : (
            quantity
          )
        ),
        
      },
      {
        title: 'จัดการ',
        dataIndex: 'actions',
        key: 'actions',
        render: (_: any, record: ReceiveProductListIF) => (
          <div>
            {editingID === record.ID ? (
              <>
                <Button type="primary" onClick={saveEditedProduct}>
                  บันทึก
                </Button>
                <Button
                  style={{ marginLeft: '10px' }}
                  onClick={() => setEditingID(null)}
                >
                  ยกเลิก
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                onClick={() => handleEdit(record)/*ส่งข้อมูล Product แถวที่คลิกไป*/}
              >
                แก้ไข
              </Button>
            )}
            <Button
                type="primary"
                danger
                onClick={() => handleDeleteProduct(record)}
              >
                ลบ
              </Button>
          </div>
        ),
      },
    ];
    
  


    return (
    <div>
    <h1 style={{fontSize: "60px"}}>Receive Product</h1>  
    

    {/* โมเดล แสดงสินค้าที่ค้นหาจาก Barcode เพื่อกรอกจำนวนสินค้า */}
    <Modal width={800} open={ModelSearchBarcode} onCancel={() => ChangeStateModelSearchBarcode(false)} footer={null} >
      <Form name='DataReceiveProduct' onFinish={ClickReceiveProduct} autoComplete="off">
      {searchBarcodeProduct && (
      <div>
        {/* แสดงรายละเอียดของสินค้า */}
        <h2>Name Product = <i>{searchBarcodeProduct.Name}</i></h2>
        <h2>ID Product = <i>{searchBarcodeProduct.ID}</i></h2>
        <h2>Barcode = <i>{searchBarcodeProduct.Barcode}</i></h2>
        <Form.Item initialValue={1} label="จำนวนที่รับ" name="quantityReceive" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
          <InputNumber min={1}  style={{ width: "100%" }} />
        </Form.Item>
        
        {/* แสดงรูปภาพ */}
        <img
            src={searchBarcodeProduct.Path}
            alt={searchBarcodeProduct.Name}
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

    {/* สินค้าใหม่ */}
    <Modal width={800} open={ModelAddNewProduct} onCancel={() => ChangeStateModelNewProduct(false)} footer={null} >
    <ImgCrop  >   
        <Upload listType="picture-card" customRequest={({ onSuccess }) => {setTimeout(() => {onSuccess && onSuccess("ok"); /*ตอบกลับ OK ทันที*/}, 0);}}  
        fileList={fileList} onChange={handleImageChange} onPreview={handlePreview} >
        {fileList.length < 1 && '+ Upload' /*fileList {เป็นตัวแปรด้านบน เริ่มแรกเป็นค่าว่าง []} จะเก็บรายการไฟล์ที่ถูกเลือกหรืออัปโหลด และจะแสดงไฟล์เหล่านั้นใน UI*/
                                            //onChange {เป็นตัวอัพเดต fileList} เป็นอีเวนต์ที่ถูกเรียกใช้เมื่อมีการเปลี่ยนแปลงในรายการไฟล์ เช่น เมื่อผู้ใช้เลือกไฟล์ใหม่หรือลบไฟล์                                           
                                            //onPreview เป็นอีเวนต์ที่ถูกเรียกใช้เมื่อผู้ใช้คลิกเพื่อดูไฟล์ (เช่น ภาพ) ที่ถูกเลือก หลังจากคลอบรูปแล้ว  ไม่ใช่ตอนดูรูปในตาราง
        }
        </Upload>
    </ImgCrop>
    {previewImage && (
        <Image
        wrapperStyle={{ display: 'none' }} 
        preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
        }}
        src={previewImage}
        />
    )}
    <Form name='DataStockProduct' onFinish={ClickAddNewProduct} autoComplete="off">
        <Form.Item label="ชื่อสินค้า" name="nameproduct" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
        <Input />
        </Form.Item>
        <Form.Item label="จำนวน" name="pieceproduct" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
        <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="เลขบาร์โค้ด" name="barcode" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginBottom: "30px" , width: "250px"}}>
        <Input style={{ width: "100%" }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{fontWeight: "bold", color: "#3c312b", backgroundColor: "#F7B22C", width: "100px", height: "38px", margin: "20px 20px 0px 20px"}}>
        ADD
        </Button>
    </Form>
    </Modal>

    {/* ปุ่ม รับสินค้าที่มีอยู่แล้ว กล้อง */}
    <Modal width={940} title={null} open={ModelOldProductScan} onCancel={() => {ChangeStateModelOldProductScan(false); setOnOffScan(false);}} footer={null} style={{ borderRadius: '12px', }}>
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

    {/* ยืนยันรายการรับสินค้า */}
    <Modal width={940} title={null} open={ModelConfirmProduct}  onOk={() => AddListReceiveProduct()} onCancel={() => ChangeStateModelConfirmProduct(false)}  style={{ borderRadius: '12px', }}>
      <h2>ยืนยันการรับสินค้า</h2>
    </Modal>





    {/* ปุ่มค้นหาสินค้าด้วย Barcode */}
    <Search  onSearch={searchProductReceive} /*onChange={(e) => setBarcodeSearch(e.target.value)}*/ allowClear placeholder="Search Barcode"  enterButton="ค้นหา" size="large" style={{ width: "600px", marginLeft: "720px", marginTop: '8px'}}/>
    
    {/* ปุ่มสแกน Barcode */}
    <Button type="primary" style={{height: "40px", width: "150px", margin: "-27px 0px 25px 1450px", backgroundColor: "#F7B22C", color: "black", fontWeight: "bold", transition: "background-color 0.1s ease",}}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F6D799")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F7B22C")}
        onClick={() => {
          ChangeStateModelOldProductScan(true); // เปิด Modal
          setOnOffScan(true); // เริ่มการทำงานของ codeReader
        }}>
        สแกน BarCode
    </Button>
    
    {/* ปุ่มสินค้าใหม่ */}
    <Button type="primary" style={{height: "40px", width: "150px", margin: "-27px 0px 25px 1450px", backgroundColor: "#F7B22C", color: "black", fontWeight: "bold", transition: "background-color 0.1s ease",}}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F6D799")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F7B22C")}
        onClick={() => ChangeStateModelNewProduct(true)}>
        สินค้าใหม่
    </Button>

    {/* ตารางรายการรับสินค้า */}
    <Table rowKey="ID" dataSource={ReceiveProductList} columns={ColumnsReceiveProduct} pagination={false} style={{ marginTop: '20px' }} />
    
    {/* ปุ่ม เพิ่มรายการสินค้า */}
    <Form name='PriceReceiving' onFinish={(values) => {SetPriceReceiving(values.priceproduct); ChangeStateModelConfirmProduct(true)}} autoComplete="off">
      <Form.Item label="ยอดรวมสินค้าที่รับมา" name="priceproduct" rules={[{ required: true, message: 'กรุณากรอกข้อมูล' }]} style={{marginTop: "30px" , width: "400px"}}>
        <InputNumber step={1} style={{ width: "100%" }} />
      </Form.Item>
      <Button htmlType="submit" type="primary" style={{ margin: '30px ' , width: '100px'}} >
        เพิ่มสินค้า
      </Button>
    </Form>

    {/* ปุ่ม ล้างรายการสินค้า */}
    <Button type="primary" style={{ margin: '30px ' , width: '100px'}} onClick={() => ClilkClearAllReceiveProduct()} >
      ล้าง
    </Button>

</div>
);
  }
  
export default ReceiveProduct;
  