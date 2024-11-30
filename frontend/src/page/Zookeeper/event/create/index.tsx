import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  message,
  Upload,
  Card,
  Divider,
  Row,
  Col,
  Space,
  Select,
} from "antd";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import { CreateEvent, ListAnimal, GetZones } from "../../../../services/https";
import { ZoneInterface } from "../../../../interface/IZone";
import { AnimalsInterface } from "../../../../interface/IAnimal";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;

const CreateEventForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [zones, setZones] = useState<ZoneInterface[]>([]);
  const [animals, setAnimals] = useState<AnimalsInterface[]>([]);
  const navigate = useNavigate();
  const { Option } = Select;

  const onFinish = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Please upload a picture");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("startDate", values.startDate.format("YYYY-MM-DD"));
    formData.append("endDate", values.endDate.format("YYYY-MM-DD"));
    formData.append("zoneID", values.zoneID);
    formData.append("animalID", values.animalID);
    formData.append("employeeID", "1"); // Set EmployeeID to 1
    formData.append("picture", fileList[0].originFileObj);

    const response = await CreateEvent(formData);

    if (response) {
      message.success("Event created successfully!");
      form.resetFields();
      setFileList([]);
      setTimeout(() => {
        navigate("/zookeeper/event");
      }, 2000);
    } else {
      message.error("Failed to create event.");
    }
  };

  const onChange = ({ fileList: newFileList }: any) => {
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

  const getZone = async () => {
    let res = await GetZones();
    if (res) {
      setZones(res);
    }
  };

  const getAnimal = async () => {
    let res = await ListAnimal();
    if (res) {
      setAnimals(res);
    }
  };

  useEffect(() => {
    getZone();
    getAnimal();
  }, []);

  return (
    <Card>
      <h2>Create Event</h2>
      <Divider />
      <Form
        form={form}
        name="basic"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={16} md={16} lg={12}>
            <Form.Item
              label="Upload Picture"
              name="picture"
              rules={[
                {
                  required: true,
                  message: "Please upload a picture",
                  validator: () => {
                    return fileList.length > 0
                      ? Promise.resolve()
                      : Promise.reject(new Error("Please upload a picture"));
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
                    return false; // Prevent automatic upload
                  }}
                  maxCount={1}
                  listType="picture-card"
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>

          <Col xs={24} sm={16} md={16} lg={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Enter event title"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter the description" },
              ]}
            >
              <TextArea
                rows={4}
                style={{ width: "100%" }}
                placeholder="Enter event description"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[
                { required: true, message: "Please select the start date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[
                { required: true, message: "Please select the end date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Zone ID"
              name="zoneID"
              rules={[{ required: true, message: "Please enter Zone ID" }]}
            >
              <Select allowClear>
                {zones.map((item) => (
                  <Option value={item.ID} key={item.Zone}>
                    {item.Zone}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Animal ID"
              name="animalID"
              rules={[{ required: true, message: "Please enter Animal ID" }]}
            >
              <Select allowClear>
                {animals.map((item) => (
                  <Option value={item.ID} key={item.Name}>
                    {item.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <Form.Item>
              <Space>
                <Button htmlType="button">Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  Create
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateEventForm;
