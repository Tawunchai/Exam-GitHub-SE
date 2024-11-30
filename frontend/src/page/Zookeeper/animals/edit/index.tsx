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
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  GetSexs,
  GetBehaviorals,
  GetBiological,
  ListHabitat,
  GetAnimalById,
  UpdateAnimal,
} from "../../../../services/https"; 
import { SexsInterface } from "../../../../interface/ISex";
import { BehavioralInterface } from "../../../../interface/IBehavioral";
import { BiologicalInterface } from "../../../../interface/IBiological";
import { HabitatInterface } from "../../../../interface/IHabitat";
import { AnimalsInterface } from "../../../../interface/IAnimal";
import { useNavigate, useParams } from "react-router-dom";

const CreateAnimalForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [sexs, setSexs] = useState<SexsInterface[]>([]);
  const [animals, setAnimals] = useState<AnimalsInterface | null>(null);
  const [behaviorals, setBehaviorals] = useState<BehavioralInterface[]>([]);
  const [biologicals, setBiologicals] = useState<BiologicalInterface[]>([]);
  const [habitats, setHabitats] = useState<HabitatInterface[]>([]);
  const navigate = useNavigate();
  const { Option } = Select;
  let { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    values.ID = animals?.ID; 

    if (values.BirthDay) {
      values.BirthDay = dayjs(values.BirthDay).format("YYYY-MM-DD");
    }
    console.log("Values to be submitted:", values); 
  
    const file = fileList.length > 0 ? fileList[0].originFileObj : null;
  
    console.log('Values to be submitted:', values);
  
    let res = await UpdateAnimal(values, file); 
  
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(() => {
        navigate("/zookeeper");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "Failed to update animal data",
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

  const getSex = async () => {
    let res = await GetSexs();
    if (res) {
      setSexs(res);
    }
  };

  const getBiological = async () => {
    let res = await GetBiological();
    if (res) {
      setBiologicals(res);
    }
  };

  const getBehavioral = async () => {
    let res = await GetBehaviorals();
    if (res) {
      setBehaviorals(res);
    }
  };

  const getHabitat = async () => {
    let res = await ListHabitat();
    if (res) {
      setHabitats(res);
    }
  };

  const getAnimalById = async () => {
    let res = await GetAnimalById(Number(id)); // ใช้ ID จาก params
    if (res) {
      setAnimals(res); // เซ็ตข้อมูลของสัตว์
      form.setFieldsValue({
        Name: res.Name,
        Weight: res.Weight,
        Height: res.Height,
        Description: res.Description,
        Birthplace: res.Birthplace,
        BirthDay: dayjs(res.BirthDay),
        Health: res.Health,
        Note: res.Note,
        SexID: res.Sex?.ID,
        BiologicalID: res.Biological?.ID,
        BehavioralID: res.Behavioral?.ID,
        HabitatID: res.Habitat?.ID,
      });
      // If there is a picture URL, initialize fileList
      if (res.Picture) {
        setFileList([
          {
            uid: '-1',
            name: res.Picture,
            status: 'done',
            url: `http://localhost:8000/${res.Picture}`, // URL of the existing picture
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getSex();
    getBiological();
    getBehavioral();
    getHabitat();
    getAnimalById();
  }, []);

  return (
    <Card>
       {contextHolder}
      <h2>Create Animal</h2>
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 0]}>
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

          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item
              label="Name"
              name="Name"
              style={{ width: "460px" }}
              rules={[
                { required: true, message: "Please enter the animal's name" },
              ]}
            >
              <Input placeholder="Enter animal name" />
            </Form.Item>

            <Row gutter={[16, 16]}>
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={8}
                style={{ marginRight: "118px" }}
              >
                <Form.Item
                  label="Weight"
                  name="Weight"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the animal's weight",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "210px" }}
                    placeholder="Enter animal weight"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8} lg={8}>
                <Form.Item
                  label="Height"
                  name="Height"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the animal's height",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "210px" }}
                    placeholder="Enter animal height"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* Block 3: Description */}
          <Col xs={24} sm={8} md={8} lg={8}>
            <Form.Item
              label="Description"
              name="Description"
              style={{ marginLeft: "80px", width: "580px" }}
              rules={[
                { required: true, message: "Please enter the description" },
              ]}
            >
              <Input.TextArea rows={5} placeholder="Enter animal description" />
            </Form.Item>
          </Col>
        </Row>

        {/* Other fields */}
        <Row gutter={[16, 10]}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Birth Date"
              name="BirthDay"
              rules={[
                { required: true, message: "Please select the birth date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Birthplace"
              name="Birthplace"
              rules={[
                { required: true, message: "Please enter the birthplace" },
              ]}
            >
              <Input placeholder="Enter animal birthplace" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Health Status"
              name="Health"
              rules={[
                { required: true, message: "Please enter the health status" },
              ]}
            >
              <Input placeholder="Enter health status" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Note"
              name="Note"
              rules={[{ required: true, message: "Please enter a note" }]}
            >
              <Input placeholder="Enter any additional notes" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Sex ID"
              name="SexID"
              rules={[{ required: true, message: "Please select the sex ID" }]}
            >
              <Select allowClear>
                {sexs.map((item) => (
                  <Option key={item.ID} value={item.ID}>
                    {item.Sex}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Biological ID"
              name="BiologicalID"
              rules={[
                { required: true, message: "Please select the biological ID" },
              ]}
            >
              <Select allowClear>
                {biologicals.map((item) => (
                  <Option key={item.ID} value={item.ID}>
                    {item.Biological}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Behavioral ID"
              name="BehavioralID"
              rules={[
                { required: true, message: "Please select the behavioral ID" },
              ]}
            >
              <Select allowClear>
                {behaviorals.map((item) => (
                  <Option key={item.ID} value={item.ID}>
                    {item.Behavioral}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12}>
            <Form.Item
              label="Habitat ID"
              name="HabitatID"
              rules={[
                { required: true, message: "Please select the habitat ID" },
              ]}
            >
              <Select allowClear>
                {habitats.map((item) => (
                  <Option key={item.ID} value={item.ID}>
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

export default CreateAnimalForm;
