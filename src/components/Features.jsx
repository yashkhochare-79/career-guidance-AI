import React from 'react';
import './Features.css';
import { Target, Map, Briefcase, FileText, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: <Target size={32} />,
    title: 'Skill Gap Analysis',
    description: 'Identify the skills you need to land your dream job with AI-driven assessments.',
    color: 'blue'
  },
  {
    icon: <Map size={32} />,
    title: 'Personalized Roadmaps',
    description: 'Get step-by-step learning paths tailored to your current skills and career goals.',
    color: 'purple'
  },
  {
    icon: <Briefcase size={32} />,
    title: 'Job Recommendations',
    description: 'Discover relevant job openings perfectly matched to your evolving profile.',
    color: 'indigo'
  },
  {
    icon: <FileText size={32} />,
    title: 'Resume Building',
    description: 'Craft ATS-friendly resumes optimized for the roles you are applying for.',
    color: 'pink'
  },
  {
    icon: <LayoutDashboard size={32} />,
    title: 'Career Dashboard',
    description: 'Track your progress, manage applications, and measure your growth in one place.',
    color: 'teal'
  }
];

const Features = () => {
  return (
    <section id="features" className="section features">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Why Choose <span className="text-gradient">CareerPath AI</span>?</h2>
          <p className="section-subtitle">
            We provide everything you need to transition from graduation to your first dream job seamlessly.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="card feature-card" key={index}>
              <div className={`feature-icon-wrapper bg-${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
