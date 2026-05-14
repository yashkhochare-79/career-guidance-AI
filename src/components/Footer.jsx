import React from 'react';
import './Footer.css';
import { Compass, Globe, Link as LinkIcon, Code, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <Compass className="logo-icon" size={28} />
              <span className="logo-text">CareerPath <span className="text-gradient">AI</span></span>
            </a>
            <p className="footer-description">
              Empowering the next generation of professionals with AI-driven career guidance, skill building, and job matching.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><Globe size={20} /></a>
              <a href="#" className="social-link"><LinkIcon size={20} /></a>
              <a href="#" className="social-link"><Code size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Platform</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Success Stories</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Resources</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Career Guides</a></li>
              <li><a href="#">Resume Templates</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="contact-info">
              <li><Mail size={18} /> yashkhochare79@gmail.com</li>
              <li><Phone size={18} /> +91 9594053288</li>
              <li><MapPin size={18} /> Kurla, Mumbai</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CareerPath AI. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
