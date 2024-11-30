import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Row,
  Col,
  Space,
  Card,
  Divider,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { GetHabitatById, UpdateHabitat } from "../../../../services/https"; // Update this import to match your service file
import { HabitatInterface } from "../../../../interface/IHabitat";
import ImgCrop from "antd-img-crop";

const EditHabitatForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [habitat, setHabitat] = useState<HabitatInterface | null>(null);
  const navigate = useNavigate();
  let { id } = useParams();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    values.ID = habitat?.ID;

    const file = fileList.length > 0 ? fileList[0].originFileObj : null;

    let res = await UpdateHabitat(values, file);

    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(() => {
        navigate("/habitats"); // redirect to habitat list or another relevant page
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to update habitat data",
      });
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

  const getHabitatById = async () => {
    let res = await GetHabitatById(Number(id)); // using ID from params
    if (res) {
      setHabitat(res); // set habitat data
      form.setFieldsValue({
        Name: res.Name,
        Size: res.Size,
        Capacity: res.Capacity,
        ZoneID: res.ZoneID,
      });
      // If there's a picture URL, initialize fileList
      if (res.Picture) {
        setFileList([
          {
            uid: "-1",
            name: res.Picture,
            status: "done",
            url: `http://localhost:8000/${res.Picture}`, // URL of the existing picture
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getHabitatById();
  }, []);

  return (
    <Card>
      {contextHolder}
      <h2>Edit Habitat</h2>
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item
              label="Upload Picture"
              name="picture"
              valuePropName="fileList"
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
                    return false;
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

          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item
              label="Name"
              name="Name"
              rules={[
                { required: true, message: "Please enter the habitat's name" },
              ]}
            >
              <Input placeholder="Enter habitat name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item
              label="Size"
              name="Size"
              rules={[
                { required: true, message: "Please enter the habitat's size" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Enter size" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item
              label="Capacity"
              name="Capacity"
              rules={[
                {
                  required: true,
                  message: "Please enter the habitat's capacity",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter capacity"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item
              label="Zone ID"
              name="ZoneID"
              rules={[{ required: true, message: "Please select the zone" }]}
            >
              <Select placeholder="Select zone">
                {/* Replace this with your actual zones */}
                <Select.Option value="1">Zone 1</Select.Option>
                <Select.Option value="2">Zone 2</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end">
          <Col>
            <Form.Item>
              <Space>
                <Button htmlType="button" onClick={() => navigate("/habitats")}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  Update
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default EditHabitatForm;
