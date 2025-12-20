// frontend/src/pages/HomePage.js
import React, { useContext } from 'react';
import { Button, Typography, Row, Col, Card, Layout, Space } from 'antd'; // Make sure Space is imported
import { EditOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;

const HomePage = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Navigate to the builder START page
    const goToBuilderStart = () => {
        navigate('/builder'); // Stays the same route
    };

    // Navigate to the analyzer page
    const goToAnalyzer = () => {
        navigate('/analyzer');
    };

    return (
        <Layout style={{ background: 'none' }}>
            <Header style={{ background: '#fff', padding: '0 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>AI Resume Project</Title>
                <Space> {/* Use Space for alignment */}
                    <span style={{ marginRight: '15px' }}>Hi, {user}!</span>
                    <Button type="primary" onClick={logoutUser}>
                        Logout
                    </Button>
                </Space>
            </Header>

            <Content style={{ padding: '40px 20px' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                    Your Dashboard
                </Title>
                <Row gutter={[32, 32]} justify="center">
                    <Col xs={24} md={10} lg={8}>
                        <Card
                            hoverable
                            actions={[
                                <Button type="primary" icon={<EditOutlined />} onClick={goToBuilderStart}> {/* Call the correct function */}
                                    Start Building
                                </Button>
                            ]}
                        >
                            <Card.Meta
                                avatar={<EditOutlined style={{ fontSize: '32px' }} />}
                                title={<Title level={4}>Resume Builder</Title>}
                                description="Create a new, professional, ATS-friendly resume from scratch using our templates."
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={10} lg={8}>
                        <Card
                            hoverable
                            actions={[
                                <Button icon={<ExperimentOutlined />} onClick={goToAnalyzer}>
                                    Analyze Now
                                </Button>
                            ]}
                        >
                            <Card.Meta
                                avatar={<ExperimentOutlined style={{ fontSize: '32px' }} />}
                                title={<Title level={4}>Resume Analyzer</Title>}
                                description="Upload your existing resume to get an AI-powered analysis, ATS score, and suggestions."
                            />
                        </Card>
                    </Col>
                </Row>
                {/* Add a section for existing resumes later */}
                {/* <Title level={3} style={{ textAlign: 'center', marginTop: '50px' }}>My Resumes</Title> */}
                {/* Display list of saved resumes here */}
            </Content>
        </Layout>
    );
};

export default HomePage;