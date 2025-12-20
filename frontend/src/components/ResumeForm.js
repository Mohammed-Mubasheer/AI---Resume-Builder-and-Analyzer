// frontend/src/components/ResumeForm.js
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Space, Checkbox, Spin, DatePicker, Upload, message, Empty, Tag } from 'antd';
import {
    PlusOutlined, DeleteOutlined, ThunderboltOutlined, LeftOutlined, RightOutlined, CloseOutlined,
    UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, SolutionOutlined,
    LinkedinOutlined, GlobalOutlined, UploadOutlined as UploadIcon,
    ReadOutlined, ExperimentOutlined, StarOutlined // Skills Icon
} from '@ant-design/icons';
import './ResumeForm_Custom.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ResumeForm = ({
    formInstance,
    onFormChange,
    initialData,
    authTokens,
    currentStep,
    setCurrentStep,
    stepTitles,
    onSave
}) => {

    const [aiLoadingIndex, setAiLoadingIndex] = useState(null);
    const [aiLoadingSummary, setAiLoadingSummary] = useState(false);
    const [aiLoadingProjectIndex, setAiLoadingProjectIndex] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [currentSkill, setCurrentSkill] = useState('');

    const onNext = () => {
        if (stepTitles && currentStep < stepTitles.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const onPrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleEnhanceExperienceAI = async (index) => {
        const description = formInstance.getFieldValue(['experience', index, 'description']);
        if (!description) return message.warn("Please write a description to enhance.");
        setAiLoadingIndex(index);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/enhance/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + String(authTokens.access) },
                body: JSON.stringify({ text: description })
            });
            if (!response.ok) throw new Error('AI enhancement failed');
            const data = await response.json();
            formInstance.setFieldsValue({ experience: { [index]: { description: data.enhanced_text } } });
            onFormChange(null, formInstance.getFieldsValue());
        } catch (error) {
            console.error("AI Enhance Error:", error);
            message.error("Sorry, we couldn't enhance the text right now.");
        } finally {
            setAiLoadingIndex(null);
        }
    };

    const handleEnhanceSummaryAI = async () => {
        const summaryText = formInstance.getFieldValue('summary');
        if (!summaryText) return message.warn("Please write a summary to enhance.");
        setAiLoadingSummary(true);
        try {
            const prompt = `Rewrite the following professional summary...`;
            const response = await fetch('http://127.0.0.1:8000/api/enhance/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + String(authTokens.access) },
                body: JSON.stringify({ text: summaryText, prompt_override: prompt })
            });
            if (!response.ok) throw new Error('AI summary enhancement failed');
            const data = await response.json();
            formInstance.setFieldsValue({ summary: data.enhanced_text });
            onFormChange(null, formInstance.getFieldsValue());
        } catch (error) {
            console.error("AI Summary Enhance Error:", error);
            message.error("Sorry, we couldn't enhance the summary right now.");
        } finally {
            setAiLoadingSummary(false);
        }
    };

    const handleEnhanceProjectAI = async (index) => {
        const description = formInstance.getFieldValue(['projects', index, 'description']);
        if (!description) return message.warn("Please write a project description to enhance.");
        setAiLoadingProjectIndex(index);
        try {
            const prompt = `Rewrite the following project description...`;
            const response = await fetch('http://127.0.0.1:8000/api/enhance/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + String(authTokens.access) },
                body: JSON.stringify({ text: description, prompt_override: prompt })
            });
            if (!response.ok) throw new Error('AI project enhancement failed');
            const data = await response.json();
            formInstance.setFieldsValue({ projects: { [index]: { description: data.enhanced_text } } });
            onFormChange(null, formInstance.getFieldsValue());
        } catch (error) {
            console.error("AI Project Enhance Error:", error);
            message.error("Sorry, we couldn't enhance the project description right now.");
        } finally {
            setAiLoadingProjectIndex(null);
        }
    };

    // MODIFIED: No Add buttons rendered here
    const renderStepTitle = () => {
        if (!stepTitles || stepTitles.length === 0 || currentStep >= stepTitles.length) {
            return <Title level={4} style={{ marginBottom: '16px' }}>Loading...</Title>;
        }
        const title = stepTitles[currentStep];

        let button = null;
        if (title === 'Professional Summary') {
            button = (<Button className="ai-button" icon={<ThunderboltOutlined />} onClick={handleEnhanceSummaryAI} loading={aiLoadingSummary} > AI Enhance </Button>);
        }

        return (
            <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={4} style={{ margin: 0 }}>{title}</Title>
                {button}
            </Space>
        );
    };

    const handleImageChange = ({ fileList: newFileList }) => {
        setImageList(newFileList);
        onFormChange(null, formInstance.getFieldsValue());
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) { message.error('You can only upload JPG/PNG file!'); }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) { message.error('Image must smaller than 2MB!'); }
        return false;
    };

    const handleAddSkill = (add) => {
        if (currentSkill && currentSkill.trim() !== '') {
            const existingSkills = formInstance.getFieldValue('skills') || [];
            const isDuplicate = existingSkills.some(skill => skill.name.toLowerCase() === currentSkill.trim().toLowerCase());
            if (!isDuplicate) {
                add({ name: currentSkill.trim() });
                setCurrentSkill('');
            } else {
                message.warning(`Skill "${currentSkill.trim()}" already added.`);
            }
        }
    };

    const handleRemoveSkill = (remove, index) => {
        remove(index);
    };

    return (
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <Form form={formInstance} layout="vertical" initialValues={initialData} onValuesChange={onFormChange} >

                <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                    <Button className="step-nav-button" icon={<LeftOutlined />} onClick={onPrev} disabled={currentStep === 0} > Previous </Button>
                    <Button className="step-nav-button" onClick={onNext} disabled={!stepTitles || currentStep === stepTitles.length - 1} > <Space> Next <RightOutlined /> </Space> </Button>
                </Space>

                {renderStepTitle()}

                {/* --- Step 0: Personal Info --- */}
                <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                    <Paragraph type="secondary" style={{ marginTop: '-10px', marginBottom: '20px' }}> Get started... </Paragraph>
                    <Form.Item name={['personalInfo', 'imageUrl']} label={<Space><UserOutlined /> Upload user image</Space>} valuePropName="fileList" getValueFromEvent={(e) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }} >
                        <Upload name="avatar" listType="picture-card" className="avatar-uploader" showUploadList={false} beforeUpload={beforeUpload} onChange={handleImageChange} >
                            {imageList.length >= 1 && imageList[0].originFileObj ? <img src={URL.createObjectURL(imageList[0].originFileObj)} alt="avatar" style={{ width: '100%' }} /> : (<div> <UploadIcon /> <div style={{ marginTop: 8 }}>Upload</div> </div>)}
                        </Upload>
                    </Form.Item>
                    <Form.Item label={<Space><UserOutlined /> Full Name</Space>} name={['personalInfo', 'name']} rules={[{ required: true, message: 'Please enter your full name!' }]} ><Input placeholder="Enter your full name" /></Form.Item>
                    <Form.Item label={<Space><MailOutlined /> Email Address</Space>} name={['personalInfo', 'email']} rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]} ><Input placeholder="Enter your email address" /></Form.Item>
                    <Form.Item label={<Space><PhoneOutlined /> Phone Number</Space>} name={['personalInfo', 'phone']} ><Input placeholder="Enter your phone number" /></Form.Item>
                    <Form.Item label={<Space><EnvironmentOutlined /> Location</Space>} name={['personalInfo', 'location']} ><Input placeholder="Enter your location (e.g., City, Country)" /></Form.Item>
                    <Form.Item label={<Space><SolutionOutlined /> Profession</Space>} name={['personalInfo', 'profession']} ><Input placeholder="Enter your profession (e.g., Student, Software Engineer)" /></Form.Item>
                    <Form.Item label={<Space><LinkedinOutlined /> LinkedIn Profile</Space>} name={['personalInfo', 'linkedin']} ><Input placeholder="Enter your LinkedIn profile URL" /></Form.Item>
                    <Form.Item label={<Space><GlobalOutlined /> Personal Website</Space>} name={['personalInfo', 'website']} ><Input placeholder="Enter your personal website/portfolio URL" /></Form.Item>
                </div>

                {/* --- Step 1: Professional Summary --- */}
                <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                    <Paragraph type="secondary" style={{ marginTop: '-10px', marginBottom: '20px' }}> Add summary... </Paragraph>
                    <Spin spinning={aiLoadingSummary} tip="Enhancing...">
                        <Form.Item name="summary">
                            <TextArea rows={5} placeholder="Write a compelling professional summary..." />
                        </Form.Item>
                    </Spin>
                    <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '10px' }}> Tip: Keep it concise... </Paragraph>
                </div>

                {/* --- Step 2: Professional Experience --- */}
                <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                    <Form.List name="experience">
                        {(fields, { add, remove }) => (
                            <>
                                <Paragraph type="secondary" style={{ marginTop: '-10px', marginBottom: '20px' }}> Add your job experience </Paragraph>
                                {fields.length === 0 && (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span> No work experience added yet. <br /> Click 'Add Experience' to get started. </span>} style={{ marginTop: '50px', marginBottom: '50px' }} />)}
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <div key={key} className="custom-form-card">
                                        <Spin spinning={aiLoadingIndex === index} tip="Enhancing...">
                                            <Title level={5} style={{ marginBottom: '16px' }}>{`Experience #${index + 1}`}</Title>
                                            <DeleteOutlined className="delete-button" onClick={() => remove(name)} />
                                            <Row gutter={16}>
                                                <Col span={12}><Form.Item {...restField} label="Company Name" name={[name, 'company']}><Input placeholder="Company Name" /></Form.Item></Col>
                                                <Col span={12}><Form.Item {...restField} label="Job Title" name={[name, 'title']}><Input placeholder="Job Title" /></Form.Item></Col>
                                                <Col span={12}><Form.Item {...restField} label="Start Date" name={[name, 'startDate']}><DatePicker picker="month" format="MMMM, YYYY" style={{ width: '100%' }} /></Form.Item></Col>
                                                <Col span={12}>
                                                    <Form.Item noStyle shouldUpdate={(pv, cv) => pv.experience?.[index]?.currentlyWorking !== cv.experience?.[index]?.currentlyWorking}>
                                                        {({ getFieldValue }) => !getFieldValue(['experience', index, 'currentlyWorking']) ?
                                                            (<Form.Item {...restField} label="End Date" name={[name, 'endDate']}><DatePicker picker="month" format="MMMM, YYYY" style={{ width: '100%' }} /></Form.Item>) :
                                                            (<Form.Item label="End Date"><Input disabled placeholder="-------, ----" /></Form.Item>)
                                                        }
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}><Form.Item {...restField} name={[name, 'currentlyWorking']} valuePropName="checked" noStyle><Checkbox>Currently working here</Checkbox></Form.Item></Col>
                                                <Col span={24} style={{ marginTop: '16px' }}>
                                                    <Form.Item {...restField} name={[name, 'description']} label={<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}> <span>Job Description</span> <Button className="ai-button" icon={<ThunderboltOutlined />} onClick={() => handleEnhanceExperienceAI(index)}> Enhance with AI </Button> </div>} >
                                                        <TextArea rows={5} placeholder="Describe your key responsibilities and achievements..." />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Spin>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" className="add-button" onClick={() => add({ title: '', company: '', startDate: null, endDate: null, description: '', currentlyWorking: false },0)} block icon={<PlusOutlined />} > Add Experience </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>

                {/* --- Step 3: Education --- */}
                <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                    <Form.List name="education">
                        {(fields, { add, remove }) => (
                            <>
                                <Paragraph type="secondary" style={{ marginTop: '-10px', marginBottom: '20px' }}> Add your education details </Paragraph>
                                {fields.length === 0 && (<Empty image={<ReadOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />} description={<span> No education added yet. <br /> Click 'Add Education' to get started. </span>} style={{ marginTop: '50px', marginBottom: '50px' }} />)}
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <div key={key} className="custom-form-card">
                                        <Title level={5} style={{ marginBottom: '16px' }}>{`Education #${index + 1}`}</Title>
                                        <DeleteOutlined className="delete-button" onClick={() => remove(name)} />
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item {...restField} label="Institution Name" name={[name, 'institutionName']}><Input placeholder="Institution Name" /></Form.Item></Col>
                                            <Col span={12}><Form.Item {...restField} label="Degree" name={[name, 'degree']}><Input placeholder="Degree (e.g., Bachelor's, Master's)" /></Form.Item></Col>
                                            <Col span={12}><Form.Item {...restField} label="Field of Study" name={[name, 'fieldOfStudy']}><Input placeholder="Field of Study" /></Form.Item></Col>
                                            <Col span={12}><Form.Item {...restField} label="Date" name={[name, 'date']}><DatePicker picker="month" placeholder="-------, ----" format="MMMM, YYYY" style={{ width: '100%' }} /></Form.Item></Col>
                                            <Col span={12}><Form.Item {...restField} label="GPA (optional)" name={[name, 'gpa']}><Input placeholder="GPA (optional)" /></Form.Item></Col>
                                        </Row>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" className="add-button" onClick={() => add({ institutionName: '', degree: '', fieldOfStudy: '', date: null, gpa: '' },0)} block icon={<PlusOutlined />} > Add Education </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>

                {/* --- Step 4: Projects --- */}
                <div style={{ display: currentStep === 4 ? 'block' : 'none' }}>
                    <Form.List name="projects">
                        {(fields, { add, remove }) => (
                            <>
                                <Paragraph type="secondary" style={{ marginTop: '-10px', marginBottom: '20px' }}> Add your projects </Paragraph>
                                {fields.length === 0 && (<Empty image={<ExperimentOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />} description={<span> No projects added yet. <br /> Click 'Add Project' to get started. </span>} style={{ marginTop: '50px', marginBottom: '50px' }} />)}
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <div key={key} className="custom-form-card">
                                        <Spin spinning={aiLoadingProjectIndex === index} tip="Enhancing...">
                                            <Title level={5} style={{ marginBottom: '16px' }}>{`Project #${index + 1}`}</Title>
                                            <DeleteOutlined className="delete-button" onClick={() => remove(name)} />
                                            <Row gutter={16}>
                                                <Col span={12}><Form.Item {...restField} label="Project Name" name={[name, 'name']}><Input placeholder="Project Name" /></Form.Item></Col>
                                                <Col span={12}><Form.Item {...restField} label="Project Type" name={[name, 'type']}><Input placeholder="e.g., Frontend Web Development" /></Form.Item></Col>
                                                <Col span={24}>
                                                    <Form.Item {...restField} label={<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}> <span>Description</span> <Button className="ai-button" icon={<ThunderboltOutlined />} onClick={() => handleEnhanceProjectAI(index)}> Enhance with AI </Button> </div>} name={[name, 'description']} >
                                                        <TextArea rows={4} placeholder="Describe your project..." />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Spin>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" className="add-button" onClick={() => add({ name: '', type: '', description: '' },0)} block icon={<PlusOutlined />} > Add Project </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>

                {/* --- Step 5: Skills (MODIFIED STRUCTURE & STYLES) --- */}
                <div style={{ display: currentStep === 5 ? 'block' : 'none' }}>
                    <Paragraph type="secondary" style={{ marginTop: '-10px', marginBottom: '20px' }}> Add your technical and soft skills </Paragraph>

                    <Form.List name="skills">
                        {(fields, { add, remove }) => {
                            const handleAddSkillLocal = () => { // Renamed to avoid conflict
                                if (currentSkill && currentSkill.trim() !== '') {
                                    const existingSkills = formInstance.getFieldValue('skills') || [];
                                    const isDuplicate = existingSkills.some(skill => skill.name.toLowerCase() === currentSkill.trim().toLowerCase());
                                    if (!isDuplicate) {
                                        add({ name: currentSkill.trim() });
                                        setCurrentSkill('');
                                    } else {
                                        message.warning(`Skill "${currentSkill.trim()}" already added.`);
                                    }
                                }
                            };

                            const handleRemoveSkillLocal = (index) => { // Renamed to avoid conflict
                                remove(index);
                            };

                            return (
                                <>
                                    {/* Input group - Apply className */}
                                    <Input.Group compact className="skills-input-group" style={{ display: 'flex' }}>
                                        <Input
                                            style={{ flexGrow: 1 }} // Input takes remaining space
                                            placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                                            value={currentSkill}
                                            onChange={(e) => setCurrentSkill(e.target.value)}
                                            onPressEnter={(e) => { e.preventDefault(); handleAddSkillLocal(); }}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={handleAddSkillLocal}
                                        > Add </Button>
                                    </Input.Group>

                                    {/* Conditional rendering for Empty state - Apply className */}
                                    {fields.length === 0 && (
                                        <div className="skills-empty-state">
                                            <StarOutlined />
                                            <div> No skills added yet.<br /> Add your technical and soft skills above. </div>
                                        </div>
                                    )}

                                    {/* Display added skills as Tags - Apply className */}
                                    {fields.length > 0 && (
                                        <div className="skills-tag-container">
                                            <Space wrap size={[8, 8]} style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {fields.map((field, index) => {
                                                    const skillName = formInstance.getFieldValue(['skills', index, 'name']);
                                                    return skillName ? (
                                                        <Tag
                                                            key={field.key}
                                                            closable
                                                            onClose={() => handleRemoveSkillLocal(index)}
                                                            className="skill-tag" // Apply className
                                                            closeIcon={<CloseOutlined />} // Keep custom close icon
                                                        >
                                                            {/* Hidden Form.Item needed by Form.List */}
                                                            <Form.Item {...field} name={[field.name, 'name']} noStyle />
                                                            {skillName}
                                                        </Tag>
                                                    ) : null;
                                                })}
                                            </Space>
                                        </div>
                                    )}

                                    {/* Tip Paragraph - Apply className */}
                                    <Paragraph className="skills-tip-box">
                                        <strong>Tip:</strong> Add 8-12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).
                                    </Paragraph>
                                </>
                            );
                        }}
                    </Form.List>
                </div>
                {/* ----------------------------------------------------------------- */}


                {/* --- Save Button --- */}
                <Button type="primary" size="large" onClick={onSave} className="save-button" style={{ width: '100%', marginTop: '24px' }}>
                    Save Changes
                </Button>
            </Form>
        </div>
    );
};

export default ResumeForm;