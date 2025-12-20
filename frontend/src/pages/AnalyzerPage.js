// frontend/src/pages/AnalyzerPage.js
import React, { useState, useContext } from 'react';
import { Layout, Row, Col, Typography, Button, Upload, Input, Form, message, Spin, Card, Progress, Tag, Divider, Select, Statistic, List, Space } from 'antd';
import { ArrowLeftOutlined, UploadOutlined, ExperimentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const jobRoles = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "Project Manager",
    "UI/UX Designer", "QA Engineer", "Business Analyst"
];

const AnalyzerPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [fileList, setFileList] = useState([]);
    const { authTokens } = useContext(AuthContext);

    const handleAnalyze = async (values) => {
        if (fileList.length === 0) {
            message.error('Please upload your resume file!');
            return;
        }
        if (!values.jobRole) {
             message.error('Please select a job role!');
             return;
        }

        setIsLoading(true);
        setReport(null);

        const formData = new FormData();
        formData.append('resume_file', fileList[0].originFileObj);
        formData.append('job_role', values.jobRole);
        if (values.jobDescription && values.jobDescription.trim() !== '') {
            formData.append('job_description', values.jobDescription);
        }

        const headers = { 'Authorization': 'Bearer ' + String(authTokens.access) };

        try {
            message.loading({ content: 'Analyzing...', key: 'analyze', duration: 0 });
            const response = await axios.post('http://127.0.0.1:8000/api/analyze/', formData, { headers });
            message.destroy('analyze');

            if (response.data && response.data.success) {
                setReport(response.data);
                message.success('Analysis Complete!');
            } else {
                throw new Error(response.data.error || 'Analysis failed.');
            }
        } catch (error) {
            message.destroy('analyze');
            console.error("Analysis API Error:", error);
            message.error(error.response?.data?.error || error.message);
            setReport(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1));
        if (report) setReport(null);
        form.validateFields(['resumeFile']);
    };

    const beforeUpload = (file) => {
        const isPdfOrDocx = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (!isPdfOrDocx) { message.error('Upload PDF or DOCX only!'); return Upload.LIST_IGNORE; }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) { message.error('File must be < 5MB!'); return Upload.LIST_IGNORE; }
        return false;
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginRight: '20px' }} > Back to Dashboard </Button>
                <Title level={4} style={{ margin: 0 }}>Resume Analyzer</Title>
            </Header>

            <Content style={{ padding: '24px' }}>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={10} lg={8}>
                        <Card>
                            <Title level={5}>Upload and Analyze</Title>
                            <Form form={form} layout="vertical" onFinish={handleAnalyze}>
                                <Form.Item name="resumeFile" label="Upload Resume" rules={[{ validator: async () => fileList.length > 0 ? Promise.resolve() : Promise.reject(new Error('Required')) }]}>
                                    <Upload fileList={fileList} onChange={handleFileChange} beforeUpload={beforeUpload} maxCount={1} accept=".pdf,.docx" itemRender={() => null}>
                                        <Button icon={<UploadOutlined />}>Click to Upload (.pdf, .docx)</Button>
                                        {fileList.length > 0 && <span style={{ marginLeft: 8 }}>{fileList[0].name}</span>}
                                    </Upload>
                                </Form.Item>
                                <Form.Item name="jobRole" label="Select Job Role" rules={[{ required: true }]}>
                                    <Select placeholder="Select role">{jobRoles.map(r => <Option key={r} value={r}>{r}</Option>)}</Select>
                                </Form.Item>
                                <Form.Item name="jobDescription" label="Paste Job Description (Optional)">
                                    <TextArea rows={10} placeholder="Paste JD for specific matching..." />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isLoading} icon={<ExperimentOutlined />} block> Analyze My Resume </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>

                    <Col xs={24} md={14} lg={16}>
                        <Card style={{ minHeight: '80vh' }}>
                            <Title level={5}>Analysis Report</Title>
                            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="Analyzing..." /></div>}
                            {!isLoading && !report && <div style={{ textAlign: 'center', padding: '50px' }}><Paragraph type="secondary">Report will appear here.</Paragraph></div>}

                            {!isLoading && report && (
                                <div>
                                    <Title level={4} style={{ marginBottom: '20px' }}>
                                        Analysis for: <Text type="success">{report.job_role_selected}</Text>
                                    </Title>

                                    <Row gutter={32} style={{ marginBottom: '25px' }}>
                                        {/* Score 1: ATS Role Score */}
                                        <Col span={12}>
                                            <Statistic title="ATS Role Match" value={report.ats_score_role} suffix="%" valueStyle={{ color: report.ats_score_role > 70 ? '#3f8600' : '#cf1322' }} />
                                             <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '5px' }}>
                                                 Based on standard skills for {report.job_role_selected} + Resume Quality.
                                             </Paragraph>
                                             {report.quality_feedback && report.quality_feedback.length > 0 && (
                                                 <div style={{marginTop: '10px'}}>
                                                     <Text strong>Notes:</Text>
                                                     <ul>
                                                         {report.quality_feedback.slice(0,3).map((fb, index) => <li key={index}><Text type="warning" style={{fontSize: '12px'}}>{fb}</Text></li>)}
                                                     </ul>
                                                 </div>
                                             )}
                                        </Col>
                                        {/* Score 2: JD Match Score */}
                                        <Col span={12}>
                                            {report.ats_score_jd !== null ? (
                                                <>
                                                    <Statistic title="Job Description Match" value={report.ats_score_jd} suffix="%" valueStyle={{ color: report.ats_score_jd > 70 ? '#3f8600' : '#cf1322' }} />
                                                    <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '5px' }}>
                                                         Based on specific JD keywords + semantic relevance.
                                                     </Paragraph>
                                                </>
                                            ) : (
                                                 <>
                                                    <Statistic title="Job Description Match" value="N/A" />
                                                    <Paragraph type="secondary" style={{ fontSize: '12px', marginTop: '5px' }}>
                                                         No JD provided. Score not calculated.
                                                     </Paragraph>
                                                 </>
                                            )}
                                        </Col>
                                    </Row>

                                    <Divider />

                                    {/* --- Role Matching Section (Always Shown) --- */}
                                    <Title level={5}>1. Match with {report.job_role_selected} (Standard)</Title>
                                    <Row gutter={[16, 16]} style={{ marginBottom: '25px' }}>
                                        <Col span={12}>
                                            <Card size="small" title={`✅ Matching Skills`}>
                                                {report.role_matching_skills?.length > 0 ? (
                                                    <Space wrap size={[4, 8]}>{report.role_matching_skills.map(skill => <Tag color="success" key={skill}>{skill}</Tag>)}</Space>
                                                ) : (<Text type="secondary">None found.</Text>)}
                                            </Card>
                                        </Col>
                                        <Col span={12}>
                                            <Card size="small" title={`❌ Missing Skills`}>
                                                {report.role_missing_skills?.length > 0 ? (
                                                     <Space wrap size={[4, 8]}>{report.role_missing_skills.slice(0, 10).map(skill => <Tag color="error" key={skill}>{skill}</Tag>)}</Space>
                                                ) : (<Text type="secondary">None missing.</Text>)}
                                            </Card>
                                        </Col>
                                    </Row>

                                    {/* --- JD Matching Section (Conditional) --- */}
                                    {report.ats_score_jd !== null && (
                                        <>
                                            <Title level={5}>2. Match with Job Description</Title>
                                            <Row gutter={[16, 16]} style={{ marginBottom: '25px' }}>
                                                <Col span={12}>
                                                    <Card size="small" title={`✅ Matching JD Keywords`}>
                                                        {report.jd_matching_skills?.length > 0 ? (
                                                            <Space wrap size={[4, 8]}>{report.jd_matching_skills.map(skill => <Tag color="success" key={skill}>{skill}</Tag>)}</Space>
                                                        ) : (<Text type="secondary">None found.</Text>)}
                                                    </Card>
                                                </Col>
                                                <Col span={12}>
                                                    <Card size="small" title={`❌ Missing JD Keywords`}>
                                                        {report.jd_missing_skills?.length > 0 ? (
                                                             <Space wrap size={[4, 8]}>{report.jd_missing_skills.slice(0,10).map(skill => <Tag color="error" key={skill}>{skill}</Tag>)}</Space>
                                                        ) : (<Text type="secondary">None missing.</Text>)}
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                                    <Divider />
                                     <Title level={5}>Extracted Info</Title>
                                     <Paragraph>Name: {report.name || <Text type="secondary">Not found</Text>}</Paragraph>
                                     <Paragraph>Email: {report.email || <Text type="secondary">Not found</Text>}</Paragraph>
                                     <Paragraph>Phone: {report.phone || <Text type="secondary">Not found</Text>}</Paragraph>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default AnalyzerPage;