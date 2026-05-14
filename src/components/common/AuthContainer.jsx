import React from 'react';
import './AuthContainer.css';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthContainer = ({ children, illustrationUrl, title, subtitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <Compass className="logo-icon" size={28} />
            <span className="logo-text text-white">CareerPath <span className="text-gradient">AI</span></span>
          </Link>
        </div>
        <div className="auth-illustration-container">
          <div className="illustration-text">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <img src={illustrationUrl} alt="Authentication" className="auth-illustration animate-float" />
        </div>
        <div className="auth-blob shape-1"></div>
        <div className="auth-blob shape-2"></div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-container animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
