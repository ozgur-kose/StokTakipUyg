import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Layout, Menu, Breadcrumb, theme, Button } from 'antd';
import { PieChartOutlined, FileOutlined, UserOutlined } from '@ant-design/icons';
import StokPage from './StokPage';
import AddProduct from '../components/AddProduct';
import DashboardStats from '../components/Dashboard';
import UserButton from '../components/UserButton';
import StokCikis from '../components/Stokcikis';
import Report from '../components/Report';


const { Header, Content, Footer, Sider } = Layout;

const getItem = (label, key, icon, children) => ({
  key,
  icon,
  children,
  label,
});

const MainPage = ({setIsAuthenticated}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('1'); 
  const navigate = useNavigate(); 

  const items = [
    getItem('ANA SAYFA', '1', <PieChartOutlined />),
    getItem('Stok Takibi', 'sub1', <UserOutlined />, [
      getItem('Stok Listesi', '5'),
      getItem('Stok Giriş', 'stok-giris'),
      getItem('Stok Çıkış', '7'),
    ]),
    getItem('Rapor', '9', <FileOutlined />),
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = ({ key }) => {
    setSelectedMenuKey(key); 
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
      <Header style={{
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          STOK TAKİP SİSTEMİ
        </div>
        <UserButton setIsAuthenticated={setIsAuthenticated} />
      </Header>


        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={[
              { title: 'Stok' },
              { title: selectedMenuKey === 'stok-giris' ? 'Giriş' : selectedMenuKey === '5' ? 'Listesi' : 'Diğer' },
            ]}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* selectedMenuKey'e göre içerik render edilir */}
            {selectedMenuKey === '1' &&<DashboardStats />}   
            {selectedMenuKey === 'stok-giris' && <AddProduct />}
            {selectedMenuKey === '5' && <StokPage />}
            {selectedMenuKey === '7' && <StokCikis />}
            {selectedMenuKey === '9' && <Report />} 
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainPage;
