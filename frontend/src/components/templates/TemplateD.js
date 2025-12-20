// frontend/src/components/templates/TemplateD.js
import React from 'react';
// NEW: Import Divider
import { Typography, Row, Col, Space, Divider } from 'antd'; // No Tags needed for this template
import {
    MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GlobalOutlined, GithubOutlined
} from '@ant-design/icons';
import './TemplateD.css'; // NEW: Import CSS file
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// NEW: Helper function (ensure dayjs is imported)
const parseSortDate = (dateString, isPresent = false) => {
    if (isPresent) return dayjs();
    if (!dateString) return dayjs(0);
    const date = dayjs(dateString);
    return date.isValid() ? date : dayjs(0);
};

// NEW: ContactItem specific for this template's header
const MinimalContactItem = ({ icon, text }) => (
    <Space className="minimal-contact-item">
        {icon}
        <Text>{text}</Text>
    </Space>
);


const TemplateD = ({ resumeData, accentColor }) => { // Accept accentColor for titles
    const {
        personalInfo = {},
        summary = '',
        experience = [],
        education = [],
        projects = [],
        skills = []
    } = resumeData || {};

    const isGithub = (url) => url && (url.includes('github.com'));
    const githubUrl = isGithub(personalInfo.website) ? personalInfo.website : null;

    return (
        // Set main container class and CSS variable
        <div className="preview-container template-minimal" style={{ '--accent-color': accentColor }}>

            {/* --- Header Section --- */}
            <div className="minimal-header">
                 <Title level={1} className="minimal-name">{personalInfo.name || 'Your Name'}</Title>
                 {/* Contact Info (single line below name) */}
                 <div className="contact-info minimal-contact-info">
                    {personalInfo.email && <MinimalContactItem icon={<MailOutlined />} text={personalInfo.email} />}
                    {personalInfo.phone && <MinimalContactItem icon={<PhoneOutlined />} text={personalInfo.phone} />}
                    {personalInfo.location && <MinimalContactItem icon={<EnvironmentOutlined />} text={personalInfo.location} />}
                    {personalInfo.linkedin && <MinimalContactItem icon={<LinkedinOutlined />} text={personalInfo.linkedin} />}
                    {githubUrl && <MinimalContactItem icon={<GithubOutlined />} text={githubUrl} />}
                    {personalInfo.website && !githubUrl && <MinimalContactItem icon={<GlobalOutlined />} text={personalInfo.website} />}
                 </div>
                 {/* No divider needed here */}
            </div>
            {/* ------------------- */}

            {/* --- Main Content Area (Single Column) --- */}
            <div className="minimal-content">
                {/* Summary Section */}
                {summary && (
                    <div className="minimal-section">
                        {/* No title for summary in this template */}
                        <Paragraph className="minimal-paragraph">{summary}</Paragraph>
                    </div>
                )}

                {/* Experience Section */}
                 {experience.length > 0 && (
                     <div className="minimal-section">
                        <Title level={4} className="minimal-section-title">Experience</Title>
                        {experience
                            .slice()
                            .sort((a, b) => { /* Sort logic */ })
                            .map((job, index) => (
                            <div key={index} className="minimal-item">
                                <Row justify="space-between" align="top">
                                    <Col flex="auto">
                                        <Title level={5} className="minimal-item-title">{job.title || 'Job Title'}</Title>
                                        <Text className="minimal-item-subtitle">{job.company || 'Company Name'}</Text>
                                    </Col>
                                    <Col flex="none">
                                        <Text className="minimal-item-date">
                                            {job.startDate ? dayjs(job.startDate).format('MMM YYYY') : ''} - {job.currentlyWorking ? 'Present' : (job.endDate ? dayjs(job.endDate).format('MMM YYYY') : '')}
                                        </Text>
                                    </Col>
                                </Row>
                                <Paragraph className="minimal-item-description">
                                    {job.description || 'Description...'}
                                </Paragraph>
                            </div>
                        ))}
                    </div>
                 )}

                {/* Projects Section */}
                {projects.length > 0 && (
                    <div className="minimal-section">
                        <Title level={4} className="minimal-section-title">Projects</Title>
                        {projects.map((project, index) => (
                            <div key={index} className="minimal-item">
                                <Row justify="space-between" align="top">
                                    <Col flex="auto">
                                        <Title level={5} className="minimal-item-title">{project.name || 'Project Name'}</Title>
                                        {project.type && <Text className="minimal-item-subtitle">{project.type}</Text>}
                                    </Col>
                                </Row>
                                <Paragraph className="minimal-item-description">
                                    {project.description || 'Project description...'}
                                </Paragraph>
                            </div>
                        ))}
                    </div>
                )}


                 {/* Education Section */}
                 {education.length > 0 && (
                     <div className="minimal-section">
                        <Title level={4} className="minimal-section-title">Education</Title>
                         {education
                            .slice()
                            .sort((a, b) => parseSortDate(b.date) - parseSortDate(a.date))
                            .map((school, index) => (
                             <div key={index} className="minimal-item">
                                 <Row justify="space-between" align="top">
                                    <Col flex="auto">
                                        <Title level={5} className="minimal-item-title">{school.degree}{school.fieldOfStudy ? ` in ${school.fieldOfStudy}` : '' || 'Degree'}</Title>
                                        <Text className="minimal-item-subtitle">{school.institutionName || 'Institution Name'}</Text>
                                        {school.gpa && <Paragraph className="minimal-item-gpa">GPA: {school.gpa}</Paragraph>}
                                    </Col>
                                    <Col flex="none">
                                        <Text className="minimal-item-date">{school.date ? dayjs(school.date).format('MMM YYYY') : ''}</Text>
                                    </Col>
                                 </Row>
                             </div>
                         ))}
                     </div>
                 )}


                  {/* Skills Section */}
                  {skills.length > 0 && (
                      <div className="minimal-section">
                        <Title level={4} className="minimal-section-title">Skills</Title>
                        <div className="minimal-skills-list">
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
            </div> {/* End minimal-content */}
        </div>
    );
};

export default TemplateD;