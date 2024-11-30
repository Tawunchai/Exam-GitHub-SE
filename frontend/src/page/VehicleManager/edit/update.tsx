import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, TreeSelect, Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UpdateVehicle, GetVehicleById } from "../../../services/https/mj";// API Service functions
import { useParams, useNavigate } from 'react-router-dom';
import { VehicleInterface } from "../../../interface/IVehicle";
import moment from 'moment';

const Update = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [vehicleData, setVehicleData] = useState<VehicleInterface | null>(null); // Store vehicle data
  const { id } = useParams(); // Get vehicle ID from URL params
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const getVehicleById = async () => {
    try {
      if (id) {
        const res = await GetVehicleById(Number(id)); // Get vehicle data by ID
        console.log('Fetched vehicle data:', res); // Log fetched data for debugging
        if (res) {
            console.log(res.ReceivedDate)
          setVehicleData(res);
          form.setFieldsValue({
            Name: res.Name,
            PriceForRent: res.Price,
            QuantityVehicle: res.QuantityVehicle,
            ReceivedDate: moment(res.ReceivedDate),
            Status: res.AvaliabilityStatus,
            Type: res.VehicleTypeID,
            EmployeeID: res.EmployeeID,
          });
          // If there is a picture URL, initialize fileList
          if (res.Picture) {
            setFileList([
              {
                uid: '-1',
                name: res.Picture,
                status: 'done',
                url: `http://localhost:8000/${res.Picture}`,
              },
            ]);
          }
        } else {
          console.error('No vehicle data found');
        }
      } else {
        messageApi.open({
          type: 'error',
          content: 'Invalid vehicle ID',
        });
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      messageApi.open({
        type: 'error',
        content: 'Failed to fetch vehicle data',
      });
    }
  };

  useEffect(() => {
    getVehicleById(); // Fetch data when component mounts
  }, [id]);

  // Handle file changes for image upload
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    console.log('Updated fileList:', newFileList); // Log the updated fileList for debugging
  };

  // Preview the uploaded image
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" style="max-width: 100%;" />`);
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    if (!vehicleData) {
        messageApi.open({
            type: 'error',
            content: 'Vehicle data not loaded properly.',
        });
        return;
    }

    values.ID = vehicleData.ID; // ส่ง ID ของยานพาหนะ
    const file = fileList.length > 0 ? fileList[0].originFileObj : null; // รับไฟล์จาก fileList

    if (values.ReceivedDate) {
        values.ReceivedDate = values.ReceivedDate.format('YYYY-MM-DD');
    }

    try {
        const res = await UpdateVehicle(values, file); // เรียกใช้ฟังก์ชัน UpdateVehicle ที่จะส่งข้อมูลไปยัง API
        if (res) {
            messageApi.open({
                type: 'success',
                content: res.message,
            });
            setTimeout(() => {
                navigate('/vehiclemanager'); // ไปที่หน้าการจัดการยานพาหนะหลังจากอัปเดตเสร็จ
            }, 2000);
        }
    } catch (error) {
        console.error('Error updating vehicle data:', error);
        messageApi.open({
            type: 'error',
            content: 'Failed to update vehicle data',
        });
    }
};


  if (!vehicleData) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <>
      {contextHolder}
      <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Column 1 */}
          <div style={{ flex: 1 }}>
            <Form.Item
              label="Upload Picture"
              name="picture"
              valuePropName="fileList"
              rules={[
                {
                  required: true,
                  message: "Please upload a picture",
                  validator: () =>
                    fileList.length > 0
                      ? Promise.resolve()
                      : Promise.reject(new Error("Please upload a picture")),
                },
              ]}
            >
              <ImgCrop rotationSlider>
                <Upload
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={(file) => {
                    setFileList([file]);
                    return false;
                  }}
                  maxCount={1}
                  listType="picture-card"
                >
                  {fileList.length < 1 && (
                    <div>
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
            <Form.Item label="ชื่อ" name="Name" rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="ราคาค่าเช่า" name="PriceForRent" rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="จำนวนยานพาหนะ" name="QuantityVehicle" rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </div>
  
          {/* Column 2 */}
          <div style={{ flex: 1 }}>
            <Form.Item label="วันที่ได้รับ" name="ReceivedDate" rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="สถานะ" name="Status" rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}>
              <Select>
                <Select.Option value="Available">พร้อมใช้งาน</Select.Option>
                <Select.Option value="Unavailable">ไม่พร้อมใช้งาน</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="ประเภท" name="Type" rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}>
              <TreeSelect
                treeData={[
                  { title: 'จักรยาน', value: '1' },
                  { title: 'รถกอล์ฟ', value: '2' },
                ]}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="รหัสพนักงาน" name="EmployeeID" rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}>
              <Input />
            </Form.Item>
          </div>
        </div>
        <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
          ส่งข้อมูล
        </Button>
      </Form>
    </>
  );  
};

export default Update;
