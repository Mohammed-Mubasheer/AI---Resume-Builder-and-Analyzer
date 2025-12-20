// frontend/src/components/templates/TemplateC.js
import React from 'react';
// NEW: Import necessary components and icons
import { Typography, Row, Col, Space, Avatar } from 'antd'; // Added Avatar
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons'; // Added UserOutlined for placeholder
import './TemplateC.css'; // NEW: Import CSS file
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// NEW: Helper function (ensure dayjs is imported)
const parseSortDate = (dateString, isPresent = false) => {
    if (isPresent) return dayjs();
    if (!dateString) return dayjs(0);
    const date = dayjs(dateString);
    return date.isValid() ? date : dayjs(0);
};

const TemplateC = ({ resumeData, accentColor }) => { // Accept accentColor, though it might not be used heavily in this design
    const {
        personalInfo = {},
        summary = '',
        experience = [],
        education = [],
        projects = [],
        skills = []
    } = resumeData || {};

    // Get image URL or use null
    const imageUrl = personalInfo.imageUrl; // Assuming imageUrl holds the URL after upload

    return (
        // Set main container class and CSS variable
        <div className="preview-container template-minimal-image" style={{ '--accent-color': accentColor }}>
            <Row gutter={[32, 0]}> {/* Add gutter for spacing, no vertical gutter needed */}

                {/* --- Sidebar (Column 1) --- */}
                <Col span={7} className="minimal-image-sidebar">
                    {/* Image Placeholder/Avatar */}
                    <div className="avatar-section">
                        {imageUrl ? (
                             <Avatar size={100} src={imageUrl} />
                        ) : (
                             <Avatar size={100} icon={<UserOutlined />} /> // Placeholder icon
                        )}
                    </div>

                    {/* Contact Section */}
                    <div className="minimal-image-section">
                        <Title level={5} className="minimal-image-sidebar-title">CONTACT</Title>
                        {personalInfo.phone && <Text className="sidebar-text"><PhoneOutlined /> {personalInfo.phone}</Text>}
                        {personalInfo.email && <Text className="sidebar-text"><MailOutlined /> {personalInfo.email}</Text>}
                        {personalInfo.location && <Text className="sidebar-text"><EnvironmentOutlined /> {personalInfo.location}</Text>}
                         {/* Add Website/LinkedIn if desired */}
                         {/* {personalInfo.linkedin && <Text className="sidebar-text"><LinkedinOutlined /> {personalInfo.linkedin}</Text>} */}
                         {/* {personalInfo.website && <Text className="sidebar-text"><GlobalOutlined /> {personalInfo.website}</Text>} */}
                    </div>

                    {/* Education Section */}
                     {education.length > 0 && (
                        <div className="minimal-image-section">
                            <Title level={5} className="minimal-image-sidebar-title">EDUCATION</Title>
                            {education
                                .slice()
                                .sort((a, b) => parseSortDate(b.date) - parseSortDate(a.date))
                                .map((edu, index) => (
                                <div key={index} className="sidebar-edu-item">
                                    <Text strong className="sidebar-degree">{edu.degree}{edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}</Text>
                                    <Text className="sidebar-school">{edu.institutionName}</Text>
                                    <Text className="sidebar-date">{edu.date ? dayjs(edu.date).format('MMM YYYY') : ''}</Text>
                                    {/* GPA not shown in screenshot sidebar */}
                                </div>
                            ))}
                        </div>
                     )}

                    {/* Skills Section */}
                    {skills.length > 0 && (
                        <div className="minimal-image-section">
                            <Title level={5} className="minimal-image-sidebar-title">SKILLS</Title>
                            {skills.map((skill, index) => (
                                skill.name && <Text key={index} className="sidebar-skill">{skill.name}</Text>
                            ))}
                        </div>
                    )}
                </Col>

                {/* --- Main Content (Column 2) --- */}
                <Col span={17} className="minimal-image-main">
                    {/* Name and Profession */}
                    <div className="main-header">
                        <Title level={1} className="minimal-image-name">{personalInfo.name || 'Your Name'}</Title>
                        {personalInfo.profession && <Text className="minimal-image-profession">{personalInfo.profession.toUpperCase()}</Text>}
                    </div>

                    {/* Summary Section */}
                    {summary && (
                        <div className="minimal-image-section main-section">
                            <Title level={4} className="minimal-image-main-title">SUMMARY</Title>
                            <Paragraph className="main-paragraph">{summary}</Paragraph>
                        </div>
                    )}

                    {/* Experience Section */}
                     {experience.length > 0 && (
                         <div className="minimal-image-section main-section">
                            <Title level={4} className="minimal-image-main-title">EXPERIENCE</Title>
                            {experience
                                .slice()
                                .sort((a, b) => {
                                    const dateB = parseSortDate(b.endDate, b.currentlyWorking);
                                    const dateA = parseSortDate(a.endDate, a.currentlyWorking);
                                    if (dateB.isSame(dateA)) { return parseSortDate(b.startDate) - parseSortDate(a.startDate); }
                                    return dateB - dateA;
                                 })
                                .map((job, index) => (
                                <div key={index} className="main-item">
                                    <Row justify="space-between" align="top">
                                        <Col flex="auto">
                                            <Title level={5} className="main-item-title">{job.title || 'Job Title'}</Title>
                                            <Text className="main-item-subtitle">{job.company || 'Company Name'}</Text>
                                        </Col>
                                        <Col flex="none">
                                            <Text className="main-item-date">
                                                {job.startDate ? dayjs(job.startDate).format('MMM YYYY') : ''} - {job.currentlyWorking ? 'Present' : (job.endDate ? dayjs(job.endDate).format('MMM YYYY') : '')}
                                            </Text>
                                        </Col>
                                    </Row>
                                    {/* Use bullet points for description */}
                                    <ul className="main-item-description">
                                        {job.description?.split('\n').map((line, i) => (line && <li key={i}>{line}</li>))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                     )}

                    {/* Projects Section */}
                    {projects.length > 0 && (
                        <div className="minimal-image-section main-section">
                            <Title level={4} className="minimal-image-main-title">PROJECTS</Title>
                            {projects.map((project, index) => (
                                <div key={index} className="main-item">
                                    <Row justify="space-between" align="top">
                                        <Col flex="auto">
                                            <Title level={5} className="main-item-title">{project.name || 'Project Name'}</Title>
                                            {project.type && <Text className="main-item-subtitle">{project.type}</Text>}
                                        </Col>
                                    </Row>
                                     {/* Use bullet points for description */}
                                     <ul className="main-item-description">
                                        {project.description?.split('\n').map((line, i) => (line && <li key={i}>{line}</li>))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                </Col>
            </Row>
        </div>
    );
};

export default TemplateC;