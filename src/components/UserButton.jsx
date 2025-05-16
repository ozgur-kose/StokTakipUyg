import React from 'react';
import { Avatar, Dropdown, Menu, message } from 'antd';
import { UserOutlined, LogoutOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const UserAvatar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const username = storedUser?.username || "Kullanıcı";

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      message.success("Başarıyla çıkış yaptınız.");
      navigate("/login");
    } else if (key === 'profile') {
      navigate("/profile");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<InfoCircleOutlined />}>
        {username} - Hesap Bilgileri
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Çıkış Yap
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
    </Dropdown>
  );
};

export default UserAvatar;
