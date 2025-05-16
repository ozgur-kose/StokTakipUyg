import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import './Login.css';
import ApiUsers from '../Api/ApiUsers';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    const { username, password } = values;

    try {
      const isAuth = await ApiUsers.authenticate(username, password);

      if (isAuth) {
        
        localStorage.setItem('user', JSON.stringify({ username }));

        setIsAuthenticated(true);
        messageApi.open({
          type: 'success',
          content: 'Giriş başarılı!',
        });
        setTimeout(() => navigate('/'), 1000);
      } else {
        messageApi.open({
          type: 'error',
          content: 'Kullanıcı adı veya şifre hatalı!',
        });
      }
    } catch (err) {
      console.error(err);
      messageApi.open({
        type: 'error',
        content: 'Giriş sırasında bir hata oluştu.',
      });
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Form
        name="login"
        initialValues={{ remember: true }}
        className="login-form"
        onFinish={onFinish}
      >
        <h2>Login</h2>

        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <div className="extra-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="">Forgot password</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            or <a href="">Register now!</a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
