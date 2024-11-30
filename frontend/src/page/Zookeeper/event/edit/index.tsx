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
import dayjs from "dayjs";
import { GetEventById, UpdateEvent, ListAnimal, GetZones } from "../../../../services/https";
import { ZoneInterface } from "../../../../interface/IZone";
import { AnimalsInterface } from "../../../../interface/IAnimal";
import { EventsInterface } from "../../../../interface/IEvent";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

const EditEventForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [zones, setZones] = useState<ZoneInterface[]>([]);
  const [animals, setAnimals] = useState<AnimalsInterface[]>([]);
  const [events, setEvents] = useState<EventsInterface | null>(null);
  const navigate = useNavigate();
  let { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const { Option } = Select;

  const onFinish = async (values: any) => {
    values.ID = events?.ID; 
    values.EmployeeID = 1;  
    if (values.startDate) {
      values.startDate = dayjs(values.startDate).format("YYYY-MM-DD");
    }
    if (values.endDate) {
      values.endDate = dayjs(values.endDate).format("YYYY-MM-DD");
    }

    const file = fileList.length > 0 ? fileList[0].originFileObj : null;
  
    console.log('Values to be submitted:', values);
  
    let res = await UpdateEvent(values, file); 
  
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(() => {
        navigate("/zookeeper/event");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to update animal data",
      });
    }
  };

  // Handle file upload change
  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  // Preview image before upload
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

  // Fetch zones
  const fetchZones = async () => {
    const res = await GetZones();
    if (res) setZones(res);
  };

  // Fetch animals
  const fetchAnimals = async () => {
    const res = await ListAnimal();
    if (res) setAnimals(res);
  };

  // Fetch event data by ID
  const fetchEventById = async () => {
    const res = await GetEventById(Number(id));
    if (res) {
      setEvents(res);
      form.setFieldsValue({
        title: res.Title,
        description: res.Description,
        startDate: dayjs(res.StartDate),
        endDate: dayjs(res.EndDate),
        zoneID: res.ZoneID,
        animalID: res.AnimalID,
      });

      if (res.Picture) {
        setFileList([
          {
            uid: "-1",
            name: res.Picture,
            status: "done",
            url: `http://localhost:8000/${res.Picture}`,
          },
        ]);
      }
    }
  };

  // Run on mount
  useEffect(() => {
    fetchZones();
    fetchAnimals();
    fetchEventById();
  }, []);

  return (
    <Card>
      {contextHolder}
      <h2>Edit Event</h2>
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Upload Picture"
              name="picture"
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
                  beforeUpload={() => false}
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

          <Col span={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input placeholder="Enter event title" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please enter the description" }]}
            >
              <TextArea rows={4} placeholder="Enter event description" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Please select the start date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "Please select the end date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Zone"
              name="zoneID"
              rules={[{ required: true, message: "Please select a zone" }]}
            >
              <Select allowClear>
                {zones.map((zone) => (
                  <Option value={zone.ID} key={zone.ID}>
                    {zone.Zone}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Animal"
              name="animalID"
              rules={[{ required: true, message: "Please select an animal" }]}
            >
              <Select allowClear>
                {animals.map((animal) => (
                  <Option value={animal.ID} key={animal.ID}>
                    {animal.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button onClick={() => navigate("/")} type="default">
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditEventForm;
