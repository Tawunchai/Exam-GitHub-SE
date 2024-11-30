import React from 'react';
import { Button, Col, Form, Input, Row, message, Card } from 'antd';
import { LoginInterface } from "../interface/Login";
import { useNavigate, Link  } from 'react-router-dom';
import { AddLogin } from "../services/https/Garfield/http";
import redpanda from "../assets/redpanda.png";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
function Login() {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('isLogin');
    localStorage.removeItem('roleName');
    localStorage.removeItem('userid');
    localStorage.removeItem('firstnameuser');
    localStorage.removeItem('lastnameuser');
    window.location.href = "/login"; 
  };

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const clickLoginbt = async (datalogin: LoginInterface) => {
    console.log('ก่อนLogin: ', datalogin);
    let res = await AddLogin(datalogin);
    console.log('หลังLogin: ', res);

    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("roleName", res.data.UserRole.RoleName);
      localStorage.setItem("userid", res.data.UserID);
      localStorage.setItem("firstnameuser", res.data.FirstNameUser);
      localStorage.setItem("lastnameuser", res.data.LastNameUser);
      
      const RoleName = localStorage.getItem("roleName");
      if (RoleName === 'Admin') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ "+ RoleName + " สำเร็จ");
        setTimeout(() => {
          navigate("/admin");
        }, 800);
      } 
      else if (RoleName === 'User') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ "+ RoleName + " สำเร็จ");
        setTimeout(() => {
          navigate("/user");
        }, 800);
      }
      else if (RoleName === 'Zookeeper') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ "+ RoleName + " สำเร็จ");
        setTimeout(() => {
          navigate("/zookeeper");
        }, 800);
      }
      else if (RoleName === 'ZooSale') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ "+ RoleName + " สำเร็จ");
        setTimeout(() => {
          navigate("/zoosale");
        }, 800);
      }
      else if (RoleName === 'Veterinarian') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ "+ RoleName + " สำเร็จ");
        setTimeout(() => {
          navigate("/vetdashboard");
        }, 800);
      }
      else if (RoleName === 'VehicleManager') {
        messageApi.success("ท่านได้ทำการ เข้าสู่ระบบ "+ RoleName + " สำเร็จ");
        setTimeout(() => {
          navigate("/vehiclemanager");
        }, 800);
      }
    }

    else {
      messageApi.open({
        type: 'warning',
        content: 'รหัสผ่านหรือข้อมูลผู้ใช้ไม่ถูกต้อง!! กรุณากรอกข้อมูลใหม่',
      });
    }
  };
  
  return (
    <div>
      {contextHolder}
      <Row style={{ height: "100vh" }} align="middle" justify="center">
        <Col
          xs={24}
          sm={18}
          md={16}
          lg={14}
          xl={12}
          style={{
            display: "flex",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Left Side Image */}
          <img
            alt="redpanda"
            style={{
              flex: 1,
              backgroundImage: "redpanda",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: '200px'
            }}
            src={redpanda}
          ></img>

          {/* Right Side Form */}
          <div style={{ flex: 1.5, padding: "30px", backgroundColor: "#fff" }}>
            <h1 style={{ textAlign: "center", fontWeight: "bold" }}>LOGIN</h1>

            <Form
              layout="vertical"
              onFinish={clickLoginbt}
              style={{ marginTop: "20px" }}
            >
              {/* Email Field */}
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Enter your email" size="large" />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input type="password"
                  placeholder="Enter your password"
                  size="large"
                  
                />
              </Form.Item>

              {/* Sign In Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    width: "100%",
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

          </div>
        </Col>
      </Row>
      <Link to="/" onClick={handleLogout}>
            <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    width: "100%",
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                    fontSize: '30px'
                  }}
                >
                  เอาไว้ Clear State Login
             </Button>
             </Link>
    </div>
  );
}

export default Login;
