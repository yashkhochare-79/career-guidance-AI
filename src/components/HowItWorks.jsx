import React from 'react';
import './HowItWorks.css';
import { UserPlus, Search, BarChart2, Compass } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={28} />,
    title: 'Create Profile',
    description: 'Sign up and enter your current graduation details and skills.'
  },
  {
    icon: <Search size={28} />,
    title: 'Select Target Job',
    description: 'Choose your desired career path or job role from our database.'
  },
  {
    icon: <BarChart2 size={28} />,
    title: 'Analyze Skills',
    description: 'Our AI analyzes your profile against industry requirements.'
  },
  {
    icon: <Compass size={28} />,
    title: 'Get Guidance',
    description: 'Receive a personalized roadmap with courses and next steps.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section how-it-works">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">How It <span className="text-gradient">Works</span></h2>
          <p className="section-subtitle">
            Four simple steps to kickstart your professional journey.
          </p>
        </div>

        <div className="steps-container">
          <div className="steps-line"></div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div className="step-item" key={index}>
                <div className="step-number">{index + 1}</div>
                <div className="step-icon-wrapper">
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
