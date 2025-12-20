// frontend/src/components/templates/TemplateA.js
import React from 'react';
// NEW: Import Divider from antd
import { Typography, Row, Col, Space, Tag, Divider } from 'antd';
import {
    MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, GithubOutlined // Keep GithubOutlined
} from '@ant-design/icons';
import './TemplateA.css'; // Uses TemplateA.css
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// ContactItem component remains the same
const ContactItem = ({ icon, text }) => (
    <Space className="contact-item">
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

const TemplateA = ({ resumeData, accentColor }) => {
    const {
        personalInfo = {},
        summary = '',
        experience = [],
        education = [],
        projects = [],
        skills = []
    } = resumeData || {};

    const isGithub = (url) => url && (url.includes('github.com'));

    // NEW: Helper function to determine GitHub URL specifically
    const getGithubUrl = (website) => {
        if (website && isGithub(website)) return website;
        return null; // Return null if website isn't GitHub
    };
    const githubUrl = getGithubUrl(personalInfo.website); // Get it once

    return (
        // MODIFIED: Added 'template-classic-preview' class
        <div className="preview-container template-classic-preview" style={{ '--accent-color': accentColor }}>

            {/* --- MODIFIED: Header Structure --- */}
            <div className="classic-header">
                 <Title level={2} className="classic-name" style={{ color: accentColor }}>{personalInfo.name || 'Your Name'}</Title>
                 <div className="contact-info classic-contact-info">
                    {/* Filter out GitHub from main contact line */}
                    {personalInfo.email && <ContactItem icon={<MailOutlined />} text={personalInfo.email} />}
                    {personalInfo.phone && <ContactItem icon={<PhoneOutlined />} text={personalInfo.phone} />}
                    {personalInfo.location && <ContactItem icon={<EnvironmentOutlined />} text={personalInfo.location} />}
                    {personalInfo.linkedin && <ContactItem icon={<LinkedinOutlined />} text={personalInfo.linkedin} />}
                    {/* Render non-GitHub website if it exists */}
                    {personalInfo.website && !isGithub(personalInfo.website) && <ContactItem icon={<GlobalOutlined />} text={personalInfo.website} />}
                 </div>
                 {/* Render GitHub separately below */}
                 {githubUrl && (
                    <div className="github-info">
                         <ContactItem icon={<GithubOutlined />} text={githubUrl} />
                    </div>
                 )}
                 <Divider className="classic-divider" style={{ borderColor: accentColor }} />
            </div>
            {/* ---------------------------------- */}


            {summary && (
                <div className="preview-section">
                    {/* MODIFIED: Use classic class */}
                    <Title level={4} className="preview-section-title classic-title">Professional Summary</Title>
                    {/* MODIFIED: Use classic class */}
                    <Paragraph className="classic-paragraph">{summary}</Paragraph>
                </div>
            )}

             {experience.length > 0 && (
                 <div className="preview-section">
                    <Title level={4} className="preview-section-title classic-title">Professional Experience</Title>
                    {experience
                        .slice()
                        .sort((a, b) => {
                            const dateB = parseSortDate(b.endDate, b.currentlyWorking);
                            const dateA = parseSortDate(a.endDate, a.currentlyWorking);
                            if (dateB.isSame(dateA)) { return parseSortDate(b.startDate) - parseSortDate(a.startDate); }
                            return dateB - dateA;
                         })
                        .map((job, index) => (
                        // MODIFIED: Added 'classic-item' class
                        <div key={index} className="experience-item classic-item">
                            {/* MODIFIED: Row/Col structure for title/date alignment */}
                            <Row justify="space-between" align="top">
                                <Col flex="auto">
                                    <Title level={5} className="classic-item-title">{job.title || 'Job Title'}</Title>
                                    <Text className="classic-item-subtitle">{job.company || 'Company Name'}</Text>
                                </Col>
                                <Col flex="none">
                                    <Text className="classic-item-date">
                                        {job.startDate ? dayjs(job.startDate).format('MMM YYYY') : ''} - {job.currentlyWorking ? 'Present' : (job.endDate ? dayjs(job.endDate).format('MMM YYYY') : '')}
                                    </Text>
                                </Col>
                            </Row>
                            {/* MODIFIED: Use classic class */}
                            <ul className="classic-item-description">
                                {job.description?.split('\n').map((line, i) => (line && <li key={i}>{line}</li>))}
                            </ul>
                        </div>
                    ))}
                </div>
             )}

            {projects.length > 0 && (
                <div className="preview-section">
                    <Title level={4} className="preview-section-title classic-title">Projects</Title>
                    {projects.map((project, index) => (
                        // MODIFIED: Added 'classic-item' class
                        <div key={index} className="experience-item classic-item">
                             {/* MODIFIED: Row/Col structure */}
                            <Row justify="space-between" align="top">
                                <Col flex="auto">
                                    <Title level={5} className="classic-item-title">{project.name || 'Project Name'}</Title>
                                    {project.type && <Text className="classic-item-subtitle">{project.type}</Text>}
                                </Col>
                            </Row>
                             {/* MODIFIED: Use classic class */}
                            <Paragraph className="classic-paragraph" style={{ marginTop: '5px' }}>
                                {project.description || 'Project description...'}
                            </Paragraph>
                        </div>
                    ))}
                </div>
            )}


             {education.length > 0 && (
                 <div className="preview-section">
                    <Title level={4} className="preview-section-title classic-title">Education</Title>
                     {education
                        .slice()
                        .sort((a, b) => parseSortDate(b.date) - parseSortDate(a.date))
                        .map((school, index) => (
                         // MODIFIED: Added 'classic-item' class
                         <div key={index} className="experience-item classic-item">
                             {/* MODIFIED: Row/Col structure */}
                             <Row justify="space-between" align="top">
                                <Col flex="auto">
                                    <Title level={5} className="classic-item-title">{school.degree}{school.fieldOfStudy ? ` in ${school.fieldOfStudy}` : '' || 'Degree'}</Title>
                                    <Text className="classic-item-subtitle">{school.institutionName || 'Institution Name'}</Text>
                                    {/* MODIFIED: Use classic class */}
                                    {school.gpa && <Paragraph className="classic-item-gpa">GPA: {school.gpa}</Paragraph>}
                                </Col>
                                <Col flex="none">
                                    <Text className="classic-item-date">{school.date ? dayjs(school.date).format('MMM YYYY') : ''}</Text>
                                </Col>
                             </Row>
                         </div>
                     ))}
                 </div>
             )}


              {skills.length > 0 && (
                  <div className="preview-section">
                    <Title level={4} className="preview-section-title classic-title">Core Skills</Title>
                    {/* Ensure this div has the correct class */}
                    <div className="classic-skills-list">
                        {skills.map((skill, index) => (
                            skill.name && (
                                <React.Fragment key={index}>
                                    <Text>{skill.name}</Text>
                                    {index < skills.length - 1 && <Text className="skill-separator"> • </Text>}
                                </React.Fragment>
                            )
                        ))}
                    </div>
                  </div>
              )}
        </div>
    );
};

export default TemplateA; // Keep export name as TemplateA