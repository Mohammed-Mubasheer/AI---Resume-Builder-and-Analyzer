// frontend/src/components/templates/TemplateB.js
import React from 'react';
// NEW: Import Divider
import { Typography, Row, Col, Space, Tag, Divider } from 'antd';
import {
    MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, GithubOutlined
} from '@ant-design/icons';
import './TemplateB.css'; // Uses TemplateB.css
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// NEW: ContactItem specific for this template's header
const ModernContactItem = ({ icon, text }) => (
    <Space className="modern-contact-item">
        {icon}
        <Text>{text}</Text>
    </Space>
);

// Helper function remains the same
const parseSortDate = (dateString, isPresent = false) => {
    if (isPresent) return dayjs();
    if (!dateString) return dayjs(0);
    const date = dayjs(dateString);
    return date.isValid() ? date : dayjs(0);
};


const TemplateB = ({ resumeData, accentColor }) => {
    const {
        personalInfo = {},
        summary = '',
        experience = [],
        education = [],
        projects = [],
        skills = []
    } = resumeData || {};

    const isGithub = (url) => url && (url.includes('github.com'));
    const githubUrl = isGithub(personalInfo.website) ? personalInfo.website : null; // Get GitHub URL

    return (
        // Set CSS variable and add main class
        <div className="preview-container template-modern" style={{ '--accent-color': accentColor }}>

            {/* --- NEW: Header Section --- */}
            <div className="modern-header">
                 <Title level={1} className="modern-name">{personalInfo.name || 'Your Name'}</Title>
                 <div className="modern-contact-info">
                    {personalInfo.email && <ModernContactItem icon={<MailOutlined />} text={personalInfo.email} />}
                    {personalInfo.phone && <ModernContactItem icon={<PhoneOutlined />} text={personalInfo.phone} />}
                    {personalInfo.location && <ModernContactItem icon={<EnvironmentOutlined />} text={personalInfo.location} />}
                    {personalInfo.linkedin && <ModernContactItem icon={<LinkedinOutlined />} text={personalInfo.linkedin} />}
                    {/* Show GitHub Icon specifically if URL detected */}
                    {githubUrl && <ModernContactItem icon={<GithubOutlined />} text={githubUrl} />}
                    {/* Show Global Icon if website exists and is NOT GitHub */}
                    {personalInfo.website && !githubUrl && <ModernContactItem icon={<GlobalOutlined />} text={personalInfo.website} />}
                 </div>
            </div>
            {/* ------------------------- */}

            {/* --- Main Content Area --- */}
            <div className="modern-content">
                {summary && (
                    <div className="modern-section">
                        <Title level={4} className="modern-section-title">Professional Summary</Title>
                        <Paragraph className="modern-paragraph">{summary}</Paragraph>
                    </div>
                )}

                 {experience.length > 0 && (
                     <div className="modern-section">
                        <Title level={4} className="modern-section-title">Experience</Title>
                        {experience
                            .slice()
                            .sort((a, b) => {
                                const dateB = parseSortDate(b.endDate, b.currentlyWorking);
                                const dateA = parseSortDate(a.endDate, a.currentlyWorking);
                                if (dateB.isSame(dateA)) { return parseSortDate(b.startDate) - parseSortDate(a.startDate); }
                                return dateB - dateA;
                             })
                            .map((job, index) => (
                            <div key={index} className="modern-item">
                                <Row justify="space-between" align="top">
                                    <Col flex="auto">
                                        <Title level={5} className="modern-item-title">{job.title || 'Job Title'}</Title>
                                        {/* NEW: Accent color for subtitle */}
                                        <Text className="modern-item-subtitle" style={{ color: accentColor }}>{job.company || 'Company Name'}</Text>
                                    </Col>
                                    <Col flex="none">
                                        <Text className="modern-item-date">
                                            {job.startDate ? dayjs(job.startDate).format('MMM YYYY') : ''} - {job.currentlyWorking ? 'Present' : (job.endDate ? dayjs(job.endDate).format('MMM YYYY') : '')}
                                        </Text>
                                    </Col>
                                </Row>
                                <Paragraph className="modern-item-description">
                                    {/* Render description directly, assuming paragraphs or use list */}
                                    {job.description || 'Description...'}
                                </Paragraph>
                            </div>
                        ))}
                    </div>
                 )}

                {projects.length > 0 && (
                    <div className="modern-section">
                        <Title level={4} className="modern-section-title">Projects</Title>
                        {projects.map((project, index) => (
                            <div key={index} className="modern-item">
                                <Row justify="space-between" align="top">
                                    <Col flex="auto">
                                        <Title level={5} className="modern-item-title">{project.name || 'Project Name'}</Title>
                                        {project.type && <Text className="modern-item-subtitle" style={{ color: accentColor }}>{project.type}</Text>}
                                    </Col>
                                    {/* No date for projects */}
                                </Row>
                                <Paragraph className="modern-item-description">
                                    {project.description || 'Project description...'}
                                </Paragraph>
                            </div>
                        ))}
                    </div>
                )}


                 {education.length > 0 && (
                     <div className="modern-section">
                        <Title level={4} className="modern-section-title">Education</Title>
                         {education
                            .slice()
                            .sort((a, b) => parseSortDate(b.date) - parseSortDate(a.date))
                            .map((school, index) => (
                             <div key={index} className="modern-item">
                                 <Row justify="space-between" align="top">
                                    <Col flex="auto">
                                        <Title level={5} className="modern-item-title">{school.degree}{school.fieldOfStudy ? ` in ${school.fieldOfStudy}` : '' || 'Degree'}</Title>
                                        <Text className="modern-item-subtitle" style={{ color: accentColor }}>{school.institutionName || 'Institution Name'}</Text>
                                        {school.gpa && <Paragraph className="modern-item-gpa">GPA: {school.gpa}</Paragraph>}
                                    </Col>
                                    <Col flex="none">
                                        <Text className="modern-item-date">{school.date ? dayjs(school.date).format('MMM YYYY') : ''}</Text>
                                    </Col>
                                 </Row>
                             </div>
                         ))}
                     </div>
                 )}


                  {skills.length > 0 && (
                      <div className="modern-section">
                        <Title level={4} className="modern-section-title">Skills</Title>
                        {/* MODIFIED: Skills rendering as Tags */}
                        <div className="modern-skills-list">
                            {skills.map((skill, index) => (
                                skill.name && <Tag key={index} className="modern-skill-tag">{skill.name}</Tag>
                            ))}
                        </div>
                      </div>
                  )}
            </div> {/* End modern-content */}
        </div>
    );
};

export default TemplateB; // Keep export name as TemplateB