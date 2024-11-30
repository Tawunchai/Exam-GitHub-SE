import React, { useState, useEffect } from "react"; 
import { Button, Card, Row, Col, Pagination, message } from "antd";
import { Vetdashboardinterface } from "../interface/VetDashboard";
import { getAllAnimals } from "../services/https/kim/http";
import './VetDashboard.css';

function Vetdashboard() {
  const [animals, setAnimals] = useState<Vetdashboardinterface[]>([]); // เก็บข้อมูลสัตว์
  const [loading, setLoading] = useState<boolean>(true); // ใช้ในการแสดงสถานะการโหลดข้อมูล
  const [currentPage, setCurrentPage] = useState(1); // หน้าที่แสดงข้อมูล
  const animalsPerPage = 5; // จำนวนสัตว์ต่อหนึ่งหน้า

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await getAllAnimals(); // ใช้ service ดึงข้อมูลสัตว์
        setAnimals(data); // ตั้งค่า animals ด้วยข้อมูลที่ได้รับ
      } catch (error) {
        message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setLoading(false); // จบการโหลดข้อมูล
      }
    };

    fetchAnimals();
  }, []);

  // คำนวณข้อมูลสัตว์ที่จะแสดงในแต่ละหน้า
  const indexOfLastAnimal = currentPage * animalsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - animalsPerPage;
  const currentAnimals = animals.slice(indexOfFirstAnimal, indexOfLastAnimal);

  // เปลี่ยนหน้าเมื่อคลิก pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <div className="container-background-vetdashboard">
      {/* Sidebar */}
      <div className="sidebar-container-vetdashboard">
        <h1 className="HeaderVetdashboard">Vetdashboard</h1>
        <ul>
          <li>Dashboard</li>
          <li>Animals</li>
          <li>Animal sick</li>
          <li>Prescriptions</li>
          <li>Animal died</li>
          <li>Analysis</li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="content-container">
        {/* Header */}
        <div className="header-container">
          <h1>Welcome to Vet Dashboard</h1>
          <button className="logoutbotton" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>

        {/* แสดงข้อมูลสัตว์ */}
        <div className="animals">
          <Row gutter={[16, 16]} style={{ marginTop: "20px", display: "flex", overflowX: "auto" }}>
            {loading ? (
              <p>กำลังโหลดข้อมูล...</p>
            ) : (
              currentAnimals.length > 0 ? (
                currentAnimals.map((animal) => (
                  <Col span={6} key={animal.ID}>
                    <Card
                      title={animal.name}
                      bordered={false}
                      cover={
                        <img
                          alt={animal.name}
                          src={animal.picture}
                          style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        />
                      }
                      style={{ marginBottom: "20px" }}
                    >
                      <p>
                        <strong>คำอธิบาย:</strong> {animal.description}
                      </p>
                      <p>
                        <strong>สถานะ:</strong> {animal.status}
                      </p>
                      <p>
                        <strong>น้ำหนัก:</strong> {animal.weight} กก.
                      </p>
                      <p>
                        <strong>ความสูง:</strong> {animal.height} เมตร
                      </p>
                      <p>
                        <strong>วันเกิด:</strong>{" "}
                        {new Date(animal.birthday).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>สถานที่เกิด:</strong> {animal.birthplace}
                      </p>
                      <p>
                        <strong>หมายเหตุ:</strong> {animal.note}
                      </p>
                      {/* Display new fields */}
                      <p>
                        <strong>ประเภท:</strong> {animal.Biological?.Biological}
                      </p>
                      <p>
                        <strong>พฤติกรรม:</strong> {animal.Behavior?.Behavior}
                      </p>
                      <p>
                        <strong>เพศ:</strong> {animal.Genderanimal?.genderanimal}
                      </p>
                      <p>
                        <strong>พนักงาน:</strong> {animal.Employee?.Bio}
                      </p>
                    </Card>
                  </Col>
                ))
              ) : (
                <p>ไม่มีข้อมูลสัตว์</p>
              )
            )}
          </Row>
          <Pagination
            current={currentPage}
            pageSize={animalsPerPage}
            total={animals.length}
            onChange={handlePageChange}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Vetdashboard;
