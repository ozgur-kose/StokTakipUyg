import React, { useEffect, useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, DatabaseOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import Api from '../Api/Api'; 
import './dashboard.css';
import { useContext } from 'react';
import { StockContext } from '../components/StockContext';

const DashboardStats = () => {
  const [toplamUrun, setToplamUrun] = useState(0);
  const { todayEntryCount, todayExitCount } = useContext(StockContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.getAll();
        const rows = response.data;
        const urunSayisi = rows.length > 0 ? rows.length  : 0; 
        setToplamUrun(urunSayisi);
      } catch (error) {
        console.error("Veri çekme hatası:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">Stok Durumu</h2>
      <Row gutter={16} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Toplam Ürün"
              value={toplamUrun}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Bugünkü Giriş" 
              value={todayEntryCount} 
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="dashboard-card">
            <Statistic
              title="Bugünkü Çıkış"
              value={todayExitCount}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats;
