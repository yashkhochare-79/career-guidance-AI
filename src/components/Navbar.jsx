import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Compass, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Compass className="logo-icon" size={28} />
          <span className="logo-text">CareerPath <span className="text-gradient">AI</span></span>
        </Link>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{fontWeight: 600}}>Log In</Link>
          <Link to="/signup" className="btn btn-primary nav-btn" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
