import React from 'react';
import { Divider, Button } from "antd";
import { Link } from "react-router-dom";
import { CheckCircleOutlined } from '@ant-design/icons';
import { FaPaw } from 'react-icons/fa';

const baseStyle: React.CSSProperties = {
  width: '25vw',  
  height: '60vh', 
  minWidth: '200px',
  minHeight: '200px',
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',   
  fontWeight: 'bold',
  textAlign: 'center',     
  flexDirection: 'column',  
  borderRadius: '5px',
  border: '1px solid #BEBEBE',
  padding: '16px', 
  position: 'relative',     
};

const ShowTicket: React.FC = () => {
  const boxesData = [
    { title: "Single", benefit: "Benefits", benefit1: "Access to zone A only.", benefit2: "Can't watch animal show.", childprice: "for Child (age 6-15) : 30 Baht", adultprice: "for Adult (age 16-60) : 50 Baht" },
    { title: "Double", benefit: "Benefits", benefit1: "Access to zone A and B.", benefit2: "Watch 2 animal shows.", childprice: "for Child (age 6-15) : 50 Baht", adultprice: "for Adult (age 16-60) : 90 Baht" },
    { title: "Triple", benefit: "Benefits", benefit1: "Access to All zones. (zone A, B, C)", benefit2: "Watch All animal shows.",  childprice: "for Child (age 6-15) : 100 Baht", adultprice: "for Adult (age 16-60) : 150 Baht" },
  ];

  return (
    <>
      <div style={{ fontSize: '3.0em', margin: '30px', textAlign: 'center' }} >TICKETS </div>
      <div style={{ fontSize: '1.2em', margin: '20px', textAlign: 'center' }} >" Discover joy with nature's amazing creatures. "</div>
      <div style={{ fontSize: '1.1em', marginTop: '30px',marginBottom: '5px', paddingLeft: '40px', color: 'red' }} >Children under 6 years old and elderly people over 60 years old can visit for  ' FREE '.</div>
      <div style={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} > 
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          {boxesData.map((box, i) => (
            <div 
              key={i} 
              style={{ ...baseStyle, backgroundColor: i % 2 ? '#F5F5F5' : '#F5F5F5' }}
            >
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'black', marginTop: '20px', marginBottom: '30px', textAlign: 'center' }}>
                {box.title}
              </div>

              <div style={{ fontSize: '1.2em', color: 'black', marginBottom: '8px', textAlign: 'left', alignSelf: 'flex-start', paddingLeft: '20px' }}>
                {box.childprice}
              </div>
              <div style={{ fontSize: '1.2em', color: 'black', marginBottom: '8px', textAlign: 'left', alignSelf: 'flex-start', paddingLeft: '20px' }}>
                {box.adultprice}
              </div>
              <Divider style={{ borderColor: '#BEBEBE' }} />
              
              <div style={{ fontSize: '1.0em', color: 'black', marginTop: '10px', marginBottom: '30px', textAlign: 'left', alignSelf: 'flex-start', paddingLeft: '10px' }}>
                {box.benefit}
              </div>
              <div style={{ fontSize: '1.0em', color: 'black', marginBottom: '15px', textAlign: 'left', alignSelf: 'flex-start', paddingLeft: '30px', display: 'flex', alignItems: 'center' }}>
                <FaPaw style={{ fontSize: '1.5em', color: '#B25900', textAlign: 'center', marginRight: '10px' }} />{box.benefit1}
              </div>
              <div style={{ fontSize: '1.0em', color: 'black', marginBottom: '15px', textAlign: 'left', alignSelf: 'flex-start', paddingLeft: '30px', display: 'flex', alignItems: 'center' }}>
                <FaPaw style={{ fontSize: '1.5em', color: '#B25900', textAlign: 'center', marginRight: '10px' }} />{box.benefit2}
              </div>

              <div style={{ flexGrow: 1 }}></div>
              <Link to="/user/ticket" style={{ display: 'block', position: 'absolute', bottom: '16px', width: 'calc(100% - 32px)' }}>
                <Button type="primary" block style={{ backgroundColor: '#FFFFFF', borderColor: '#B25900', color: '#B25900', height: '40px', fontSize: '20px', fontWeight: 'bold', borderRadius: '10px' }}>
                  Choose
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShowTicket;