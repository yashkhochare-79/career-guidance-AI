import React from 'react';
import './Hero.css';
import { ArrowRight, Sparkles } from 'lucide-react';
import NavButton from './common/NavButton';

const Hero = () => {
  return (
    <header className="hero">
      <div className="hero-background">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
      </div>
      <div className="container hero-container">
        <div className="hero-content animate-fade-in-up">
          <div className="badge">
            <Sparkles size={16} className="badge-icon" />
            <span>AI-Powered Career Navigation</span>
          </div>
          <h1 className="hero-title">
            Build Your Career with <br />
            <span className="text-gradient">Smart Guidance</span>
          </h1>
          <p className="hero-description">
            Empowering graduation students with personalized roadmaps, skill gap analysis, and job-ready recommendations. Transform your potential into success.
          </p>
          <div className="hero-actions">
            <NavButton to="/signup" className="btn btn-primary btn-lg">
              Get Started <ArrowRight size={20} />
            </NavButton>
            <NavButton to="/signup" className="btn btn-secondary btn-lg">
              Explore Careers
            </NavButton>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Students Placed</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-visual animate-float">
          <div className="hero-image-container">
            <img 
              src="/hero_illustration.png" 
              alt="Students collaborating" 
              className="hero-image"
            />
            <div className="floating-card card-1">
              <div className="card-icon-wrapper">
                <div className="card-icon green"></div>
              </div>
              <div className="card-text">
                <span className="card-title">Skill Match</span>
                <span className="card-subtitle">95% Compatible</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon-wrapper">
                <div className="card-icon purple"></div>
              </div>
              <div className="card-text">
                <span className="card-title">New Roadmap</span>
                <span className="card-subtitle">Data Scientist</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
