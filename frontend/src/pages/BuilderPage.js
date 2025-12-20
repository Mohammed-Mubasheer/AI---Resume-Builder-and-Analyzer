// frontend/src/pages/BuilderPage.js
import React, { useState, useContext } from 'react';
// NEW: Import List component
import {
    Layout, Row, Col, Typography, Button, Space, Form, Radio, message, Modal, Card, Popover, Input, List
} from 'antd';
// NEW: Import CheckOutlined
import {
    ArrowLeftOutlined, DownloadOutlined, EyeOutlined, BgColorsOutlined, UndoOutlined, CheckOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import BuilderStartOptions from '../components/BuilderStartOptions';
import axios from 'axios';
import dayjs from 'dayjs';
import { SketchPicker } from 'react-color';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography; // Added Paragraph

const stepTitles = ['Personal Information', 'Professional Summary', 'Professional Experience', 'Education', 'Projects', 'Skills'];
const initialData = {
    personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        profession: "",
        linkedin: "",
        website: "",
        imageUrl: null
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: []
};

// MODIFIED: Use descriptive IDs and add descriptions for template options
const templateOptions = [
  { id: 'classic', name: 'Classic', description: 'A clean, traditional resume format with clear sections and professional typography.' },
  { id: 'modern', name: 'Modern', description: 'Sleek design with strategic use of color and modern font choices.' },
  { id: 'minimalImage', name: 'Minimal Image', description: 'Minimal design with a single image and clean typography.' },
  { id: 'minimal', name: 'Minimal', description: 'Ultra-clean design that puts your content front and center.' },
];
// -----------------------------------------------------------------------

const DEFAULT_ACCENT_COLOR = '#3b82f6';

const BuilderPage = () => {
    const navigate = useNavigate();
    const { authTokens } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [resumeId, setResumeId] = useState(null);
    const [resumeData, setResumeData] = useState(initialData);
    const [currentStep, setCurrentStep] = useState(0);
    const [templateId, setTemplateId] = useState('classic'); // Defaulting to 'classic'
    // REMOVED: isTemplateModalVisible state removed
    const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT_COLOR);
    const [accentPopoverVisible, setAccentPopoverVisible] = useState(false); // Renamed state
    const [showEditor, setShowEditor] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newResumeTitle, setNewResumeTitle] = useState("My Resume");

    // NEW: State for Template Popover visibility
    const [templatePopoverVisible, setTemplatePopoverVisible] = useState(false);

    const handleFormChange = (changedValues, allValues) => { setResumeData(allValues); };

    // Full handleSave function
    const handleSave = async () => {
        message.loading({ content: 'Saving...', key: 'save' });
        const currentResumeData = form.getFieldsValue();
        const payload = {
            title: resumeId ? (currentResumeData.personalInfo.name + "'s Resume") : newResumeTitle,
            resume_data: currentResumeData
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        };
        try {
            let response;
            if (resumeId) {
                response = await axios.put(`http://127.0.0.1:8000/api/resumes/${resumeId}/`, payload, { headers });
            } else {
                response = await axios.post('http://127.0.0.1:8000/api/resumes/', payload, { headers });
                setResumeId(response.data.id);
            }
            message.success({ content: 'Saved successfully!', key: 'save', duration: 2 });
        } catch (error) {
            console.error('Save error:', error);
            message.error({ content: 'Failed to save!', key: 'save', duration: 2 });
        }
    };

    // REMOVED: showTemplateModal function removed

    // MODIFIED: handleSelectTemplate now also closes the Popover
    const handleSelectTemplate = (id) => {
        setTemplateId(id);
        setTemplatePopoverVisible(false); // Close template popover on selection
    };

    const handleColorChange = (color) => { setAccentColor(color.hex); };
    const resetColor = () => { setAccentColor(DEFAULT_ACCENT_COLOR); setAccentPopoverVisible(false); }; // Close popover
    // MODIFIED: Renamed handler for accent popover visibility
    const handleAccentVisibleChange = (visible) => { setAccentPopoverVisible(visible); };

    const colorOptions = ['#3b82f6', '#10b981', '#ef4444', '#f97316', '#8b5cf6'];
    // Full colorPickerContent variable
    const colorPickerContent = (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {colorOptions.map(color => ( <div key={color} style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, cursor: 'pointer', border: accentColor === color ? '2px solid black' : '1px solid #ccc' }} onClick={() => { setAccentColor(color); setAccentPopoverVisible(false); }} /> ))}
            </div>
             <Button icon={<UndoOutlined />} onClick={resetColor} size="small" block> Reset to Default </Button>
            {/* Optional SketchPicker
             <SketchPicker color={accentColor} onChangeComplete={handleColorChange} presetColors={[]} disableAlpha width="220px" />
             <Button onClick={() => setAccentPopoverVisible(false)} size="small" style={{marginTop: '10px'}} block>Done</Button>
            */}
        </div>
    );


    const showCreateModal = () => { setNewResumeTitle("My Resume"); setIsCreateModalVisible(true); };
    // Full handleConfirmCreate function
    const handleConfirmCreate = () => {
        setIsCreateModalVisible(false);
        const dataWithTitle = { ...initialData };
        form.setFieldsValue(dataWithTitle);
        setResumeData(dataWithTitle);
        setResumeId(null);
        setCurrentStep(0);
        setShowEditor(true);
    };
    // Full handleCancelCreate function
    const handleCancelCreate = () => { setIsCreateModalVisible(false); };

    // NEW: Template Popover Content using Ant Design List
    const templateSelectionContent = (
        <List
            dataSource={templateOptions}
            renderItem={item => (
                <List.Item
                    onClick={() => handleSelectTemplate(item.id)}
                    style={{ cursor: 'pointer', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}
                    className={templateId === item.id ? 'template-selected' : 'template-option'}
                >
                    <List.Item.Meta
                        title={<Text strong style={{fontSize: '14px'}}>{item.name}</Text>}
                        description={<Paragraph style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{item.description}</Paragraph>}
                    />
                    {templateId === item.id && <CheckOutlined style={{ color: '#3b82f6', fontSize: '16px' }} />}
                </List.Item>
            )}
            style={{ width: 300, padding: 0 }}
            size="small"
        />
    );
    // ----------------------------------------------------


    return (
        <Layout style={{ minHeight: '100vh', background: '#f9f9f9' }}>
             <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <Space> {/* Left Side */}
                    {showEditor ? ( <Button icon={<ArrowLeftOutlined />} onClick={() => setShowEditor(false)}> Back to Options </Button> ) : ( <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}> Back to Dashboard </Button> )}
                 </Space>
                 {showEditor && (
                    <Space>
                        <Radio.Group value="controls" buttonStyle="solid">
                             {/* MODIFIED: Template Button now uses Popover */}
                            <Popover
                                content={templateSelectionContent}
                                trigger="click"
                                placement="bottomLeft"
                                open={templatePopoverVisible}
                                onOpenChange={setTemplatePopoverVisible}
                                overlayClassName="template-popover"
                            >
                                <Radio.Button value="template" style={{ borderRadius: '6px 0 0 6px' }}> Template </Radio.Button>
                            </Popover>
                             <Popover
                                content={colorPickerContent}
                                title="Select Accent Color"
                                trigger="click"
                                open={accentPopoverVisible} // Renamed state
                                onOpenChange={handleAccentVisibleChange} // Renamed handler
                             >
                                <Radio.Button value="accent" style={{ borderRadius: '0 6px 6px 0' }}> <BgColorsOutlined /> Accent </Radio.Button>
                             </Popover>
                        </Radio.Group>
                        {/* Next Button is handled inside ResumeForm */}
                    </Space>
                 )}
                <Space> {/* Right Side */}
                     <Button icon={<EyeOutlined />} style={{ borderRadius: '6px' }}>Private</Button>
                     <Button type="primary" icon={<DownloadOutlined />} style={{ borderRadius: '6px', background: '#22c55e' }}> Download </Button>
                 </Space>
            </Header>

            <Content style={{ padding: '24px' }}>
                {!showEditor ? (
                    <BuilderStartOptions showCreateModal={showCreateModal} />
                ) : (
                    <Row gutter={[24, 24]} style={{ height: '100%' }}>
                        <Col xs={24} md={10} lg={10}>
                            <ResumeForm
                                formInstance={form}
                                onFormChange={handleFormChange}
                                initialData={initialData}
                                authTokens={authTokens}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                                stepTitles={stepTitles}
                                onSave={handleSave}
                            />
                        </Col>
                        <Col xs={24} md={14} lg={14} style={{ background: '#fff', padding: '24px', borderRadius: '8px', height: '85vh', overflowY: 'auto' }}>
                            <ResumePreview
                                resumeData={resumeData}
                                templateId={templateId} // Pass current templateId
                                accentColor={accentColor}
                             />
                        </Col>
                    </Row>
                )}
            </Content>

            {/* REMOVED: Template Selection Modal removed */}

            {/* Create Resume Title Modal */}
            <Modal title="Create a Resume" open={isCreateModalVisible} onOk={handleConfirmCreate} onCancel={handleCancelCreate} okText="Create Resume" okButtonProps={{ style: { backgroundColor: '#22c55e', borderColor: '#22c55e' } }} closable={true} >
                <Input placeholder="Enter resume title" value={newResumeTitle} onChange={(e) => setNewResumeTitle(e.target.value)} />
            </Modal>
        </Layout>
    );
};

export default BuilderPage;