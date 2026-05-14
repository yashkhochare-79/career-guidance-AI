import React from 'react';
import './CTA.css';
import { Rocket } from 'lucide-react';
import NavButton from './common/NavButton';

const CTA = () => {
  return (
    <section className="section cta">
      <div className="container">
        <div className="cta-box">
          <div className="cta-content text-center">
            <h2 className="cta-title">Ready to Fast-Track Your Career?</h2>
            <p className="cta-description">
              Join thousands of students who have already transformed their career trajectories. 
              Get your personalized guidance today and take the first step towards your dream job.
            </p>
            <NavButton to="/signup" className="btn btn-primary btn-lg cta-btn">
              Start Your Journey <Rocket size={20} />
            </NavButton>
          </div>
          
          {/* Decorative elements */}
          <div className="cta-shape shape-1"></div>
          <div className="cta-shape shape-2"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
