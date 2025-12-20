// frontend/src/pages/RegisterPage.js
import React, { useContext } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const { Title } = Typography;

const RegisterPage = () => {
    const { registerUser } = useContext(AuthContext);

    const onFinish = (values) => {
        if (values.password !== values.password2) {
            alert("Passwords do not match!");
            return;
        }
        registerUser(values.username, values.email, values.password);
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
            <Col xs={24} sm={16} md={12} lg={8} xl={6}>
                <Card>
                    <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
                    <Form name="register" onFinish={onFinish}>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'Not a valid email!' }]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item
                            name="password2"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your Password!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Register
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            Already have an account? <Link to="/login">Login here!</Link>
                        </div>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;