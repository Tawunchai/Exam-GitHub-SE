import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, TreeSelect, Upload, Row, Col } from 'antd';
import ImgCrop from 'antd-img-crop';
import { CreateVehicle } from "../../../services/https/mj";
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();

  const onChange = ({ fileList: newFileList }: any) => {
    console.log('Updated File List:', newFileList);
    setFileList(newFileList);
  };

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

  const onFinish = async (values: any) => {
    console.log('Form Values:', values);
    console.log('File List:', fileList);

    const formData = new FormData();
    formData.append('name', values.Name);
    formData.append('price', values['Price for rent']);
    formData.append('quantityVehicle', values.QuantityVehicle);
    formData.append('receivedDate', values['Received Date'].format('YYYY-MM-DD'));
    formData.append('avaliabilityStatus', values.Status);
    formData.append('vehicleTypeID', values.Type);
    formData.append('employeeID', values.EmployeeID);

    if (fileList.length > 0) {
      formData.append('picture', fileList[0].originFileObj); // Add image file
    } else {
      alert('กรุณาอัปโหลดรูปภาพ');
      return;
    }

    try {
      const response = await CreateVehicle(formData);
      if (response) {
        console.log('สร้างยานพาหนะสำเร็จ', response);
        setTimeout(() => {
          navigate('/vehiclemanager'); // ไปที่หน้าการจัดการยานพาหนะหลังจากอัปเดตเสร็จ
        }, 2000);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการสร้างยานพาหนะ:', error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 600 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="อัปโหลดรูปภาพ"
            name="picture"
            valuePropName="fileList"
            rules={[
              {
                required: true,
                message: 'กรุณาอัปโหลดรูปภาพ',
                validator: () => {
                  return fileList.length > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error('กรุณาอัปโหลดรูปภาพ'));
                },
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
                    <div style={{ marginTop: 8 }}>อัปโหลด</div>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="ราคาค่าเช่า"
            name="Price for rent"
            rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="ชื่อ"
            name="Name"
            rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="จำนวนยานพาหนะ"
            name="QuantityVehicle"
            rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="วันที่ได้รับ"
            name="Received Date"
            rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="สถานะ"
            name="Status"
            rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}
          >
            <Select>
              <Select.Option value="Available">พร้อมใช้งาน</Select.Option>
              <Select.Option value="Unavailable">ไม่พร้อมใช้งาน</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="ประเภท"
            name="Type"
            rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}
          >
            <TreeSelect
              treeData={[
                { title: 'จักรยาน', value: '1' },
                { title: 'รถกอล์ฟ', value: '2' },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="รหัสพนักงาน"
            name="EmployeeID"
            rules={[{ required: true, message: 'กรุณากรอกข้อมูล!' }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Confirm
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default Create;