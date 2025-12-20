// frontend/src/components/BuilderStartOptions.js
import React from 'react';
import { Row, Col, Card, Space, Typography } from 'antd';
import { PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import '../pages/HomePage_Custom.css'; // Reuse the CSS

const { Text } = Typography;

// Takes a function to call when 'Create Resume' is clicked
const BuilderStartOptions = ({ showCreateModal }) => {

    const handleUploadClick = () => {
         alert("Upload Existing - Functionality Coming Soon!");
    }

    return (
        <Row gutter={[32, 32]} justify="center" style={{ marginTop: '50px' }}>
            {/* --- Create Resume Card --- */}
            <Col>
                <Card
                    hoverable
                    className="dashboard-card" // Use the styling
                    onClick={showCreateModal} // Call the function passed from the parent
                >
                    <Space direction="vertical" align="center" size="large">
                        <PlusCircleOutlined className="dashboard-card-icon" />
                        <Text strong>Create Resume</Text>
                    </Space>
                </Card>
            </Col>

            {/* --- Upload Existing Card --- */}
            <Col>
                <Card
                    hoverable
                    className="dashboard-card"
                    onClick={handleUploadClick}
                >
                    <Space direction="vertical" align="center" size="large">
                        <UploadOutlined className="dashboard-card-icon" />
                        <Text strong>Upload Existing</Text>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};

export default BuilderStartOptions;