import React, { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetVehicle, DeleteVehicleByID } from "../../services/https/mj";
import { VehicleInterface } from "../../interface/IVehicle";
import { Link, useNavigate } from "react-router-dom";
import  Navbar  from "../../component/vehiclemanager/topbar";
import dayjs from "dayjs";

function Vehicle() {
  const columns: ColumnsType<VehicleInterface> = [
    {
      title: "ID",
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "Picture",
      dataIndex: "Profile",
      key: "Name",
      width: "15%",
      render: (text, record, index) => (
        <img
          src={`http://localhost:8000/${record.Picture}`}
          className="w3-left w3-circle w3-margin-right"
          width="100%"
          alt="Profile"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "QuantityVehicle",
      key: "quantityVehicle",
    },
    {
      title: "Status",
      dataIndex: "AvaliabilityStatus",
      key: "avaliabilityStatus",
    },
    {
      title: "Received Date",
      dataIndex: "ReceivedDate",
      key: "receivedDate",
      render: (record) => <p>{dayjs(record).format("dddd DD MMM YYYY")}</p>,
    },
    {
      title: "Manage",
      dataIndex: "Manage",
      key: "manage",
      render: (text, record, index) => (
        <>
          <Button 
            onClick={() => navigate(`/vehiclemanager/vehicles/edit/${record.ID}`)}
            shape="circle"
            icon={<EditOutlined />}
            size={"large"} />
          <Button
            onClick={() => showModal(record)}
            style={{ marginLeft: 10 }}
            shape="circle"
            icon={<DeleteOutlined />}
            size={"large"}
            danger
          />
        </>
      ),
    },
  ];

  const navigate = useNavigate();

  const [vehicles, setVehicle] = useState<VehicleInterface[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  // Model
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<String>();
  const [deleteId, setDeleteId] = useState<Number>();

  const getUsers = async () => {
    try {
      const res = await GetVehicle();
      if (res && Array.isArray(res)) {
        console.log("Fetched vehicles:", res);
        setVehicle(res);
      } else {
        console.error("Received data is not an array:", res);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      messageApi.open({
        type: "error",
        content: "ไม่สามารถโหลดข้อมูลได้",
      });
    }
  };

  const showModal = (val: VehicleInterface) => {
    setModalText(`คุณต้องการลบข้อมูลผู้ใช้ "${val.Name}" หรือไม่ ?`);
    setDeleteId(val.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    let res = await DeleteVehicleByID(deleteId);
    if (res) {
      setOpen(false);
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      getUsers();
    } else {
      setOpen(false);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด !",
      });
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการข้อมูลสมาชิก</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/vehiclemanager/create-vehicle">
              <Button type="primary" icon={<PlusOutlined />}>
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table rowKey="ID" columns={columns} dataSource={vehicles} />
      </div>
      <Modal
        title="ลบข้อมูล ?"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default Vehicle;
