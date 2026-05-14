import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, UserCircle, Target, Briefcase, Settings, LogOut, Menu, X, Compass, BarChart2, FileText } from 'lucide-react';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skill Analysis', path: '/skills', icon: BarChart2 },
    { name: 'Roadmap', path: '/roadmap', icon: Target },
    { name: 'Job Recommendations', path: '/jobs', icon: Briefcase },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <Compass className="logo-icon" size={24} />
            {sidebarOpen && <span className="logo-text">CareerPath</span>}
          </Link>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={index} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={!sidebarOpen ? item.name : ''}
              >
                <Icon size={20} className="nav-icon" />
                {sidebarOpen && <span className="nav-name">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item text-danger" style={{ width: '100%', textAlign: 'left' }}>
            <LogOut size={20} className="nav-icon" />
            {sidebarOpen && <span className="nav-name">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="logo-text">CareerPath AI</span>
          <div style={{ width: 24 }}></div> {/* Spacer */}
        </header>
        
        {/* Mobile Overlay */}
        {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>}
        
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
