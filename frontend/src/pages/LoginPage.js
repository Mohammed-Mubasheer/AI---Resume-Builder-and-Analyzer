// frontend/src/pages/LoginPage.js
import React, { useContext } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const { Title } = Typography;

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext);

    const onFinish = (values) => {
        loginUser(values.username, values.password);
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
            <Col xs={24} sm={16} md={12} lg={8} xl={6}>
                <Card>
                    <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
                    <Form name="login" onFinish={onFinish}>
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
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Log in
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            Or <Link to="/register">register now!</Link>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;