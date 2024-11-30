import React from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const items1 = [
  { key: 'vehicle', label: <Link to="/vehiclemanager">Vehicle</Link> },
  { key: 'rental', label: <Link to="/vehiclemanager/rental">Rental</Link> },
];

const TopBar: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      {/* Header */}
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal" items={items1} style={{ flex: 1, minWidth: 0 }} />
      </Header>

      {/* Content */}
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          {/*<Breadcrumb.Item>Vehicle Data Menagement</Breadcrumb.Item>*/}
        </Breadcrumb>
        <Layout
          style={{
            padding: '24px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', color: '#b3b6b7'}}>
        Vehicle Data Menagement
      </Footer>
    </Layout>
  );
};

export default TopBar;
