// frontend/src/components/ResumePreview.js
import React from 'react';

// Import all templates
import TemplateA from './templates/TemplateA'; // This is now assigned to 'classic'
import TemplateB from './templates/TemplateB'; // This is now assigned to 'modern'
import TemplateC from './templates/TemplateC'; // Minimal Image (Placeholder)
import TemplateD from './templates/TemplateD'; // Minimal (Placeholder)
// REMOVED: import TemplateClassic (since TemplateA now serves this role)

const ResumePreview = ({ resumeData, templateId, accentColor }) => {

  switch (templateId) {
    // MODIFIED: 'classic' now uses TemplateA
    case 'classic':
      return <TemplateA resumeData={resumeData} accentColor={accentColor} />;
    // MODIFIED: 'modern' now uses TemplateB
    case 'modern':
      return <TemplateB resumeData={resumeData} accentColor={accentColor} />;
    case 'minimalImage':
      return <TemplateC resumeData={resumeData} accentColor={accentColor} />;
    case 'minimal':
      return <TemplateD resumeData={resumeData} accentColor={accentColor} />;

    default: // Default to classic
      return <TemplateA resumeData={resumeData} accentColor={accentColor} />;
  }
};

export default ResumePreview;