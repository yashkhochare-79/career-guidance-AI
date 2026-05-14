import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useUser } from '../context/UserContext';
import { BookOpen, Briefcase, ChevronRight, Clock, Star, Target, TrendingUp, Zap } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useUser();

  const name = user.fullName || 'Student';
  const firstName = name.split(' ')[0];
  const skills = user.skills || [];
  const careerGoal = user.careerGoal || 'Software Engineering';
  const college = user.collegeName || 'University';
  const degree = user.degree || '';
  const branch = user.branch || '';

  // Compute job readiness from how many skills the user has
  const jobReadiness = Math.min(95, Math.round(20 + skills.length * 8));

  const topSkills = skills.slice(0, 4).map((s, i) => ({
    name: s,
    level: Math.max(40, 95 - i * 12)
  }));

  const recommendedSkills = [
    { name: 'TypeScript', time: '4 weeks', icon: Zap, color: 'blue' },
    { name: 'System Design', time: '6 weeks', icon: BookOpen, color: 'purple' },
    { name: 'AWS Cloud', time: '8 weeks', icon: Target, color: 'indigo' },
  ];

  const activities = [
    { title: 'Completed Onboarding Profile', time: 'Just now', icon: Star },
    { title: `Set career goal: ${careerGoal}`, time: 'Just now', icon: Target },
    { title: `Added ${skills.length} skills to profile`, time: 'Just now', icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-wrapper">

        {/* Welcome Section */}
        <section className="dashboard-welcome animate-fade-in-up">
          <div>
            <h1 className="welcome-title">Welcome back, {firstName}! 👋</h1>
            <p className="welcome-subtitle">Here's what's happening with your career progress today.</p>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Profile Summary & Job Readiness */}
          <div className="dashboard-row grid-cols-3">

            <div className="dash-card profile-card col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="profile-header">
                <div className="profile-avatar-placeholder">{firstName.charAt(0)}</div>
                <div className="profile-info">
                  <h3>{name}</h3>
                  <p>{degree} {branch ? `— ${branch}` : ''}</p>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">University</span>
                  <span className="detail-value">{college}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Target Domain</span>
                  <span className="detail-value text-gradient">{careerGoal}</span>
                </div>
                {skills.length > 0 && (
                  <div className="detail-item">
                    <span className="detail-label">Skills</span>
                    <div className="mini-skill-tags">
                      {skills.slice(0, 5).map(s => <span key={s} className="mini-skill">{s}</span>)}
                      {skills.length > 5 && <span className="mini-skill more">+{skills.length - 5}</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="dash-card readiness-card col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-header">
                <h3>Job Readiness Score</h3>
                <span className="badge badge-success">{jobReadiness >= 60 ? 'On Track' : 'Getting Started'}</span>
              </div>
              <div className="readiness-content">
                <div className="readiness-chart">
                  <div className="circular-progress" style={{ '--progress': `${jobReadiness}%` }}>
                    <div className="inner-circle">
                      <span className="progress-value">{jobReadiness}%</span>
                    </div>
                  </div>
                </div>
                <div className="readiness-info">
                  <h4>{jobReadiness >= 60 ? 'You are getting closer!' : 'Great start — keep going!'}</h4>
                  <p>Your profile aligns with entry-level <strong>{careerGoal}</strong> roles. Complete your recommended skills to boost your score.</p>
                  <Link to="/roadmap" className="link-action">View Your Roadmap <ArrowRightIcon /></Link>
                </div>
              </div>
            </div>

          </div>

          {/* Skills Overview & Next Skills */}
          <div className="dashboard-row grid-cols-2">

            <div className="dash-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-header">
                <h3>Top Skills Overview</h3>
                <button className="btn-icon" title="View Details"><TrendingUp size={18} /></button>
              </div>
              {topSkills.length > 0 ? (
                <div className="skills-list">
                  {topSkills.map((skill, idx) => (
                    <div className="skill-item" key={idx}>
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-percentage">{skill.level}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${skill.level}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-gray)', padding: '1rem 0' }}>
                  Complete onboarding to see your skill breakdown.
                  <Link to="/onboarding" style={{ color: 'var(--color-primary)', fontWeight: 600, marginLeft: '0.5rem' }}>Get Started</Link>
                </p>
              )}
            </div>

            <div className="dash-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="card-header">
                <h3>Recommended Next Skills</h3>
                <span className="badge badge-primary">AI Suggested</span>
              </div>
              <div className="recommended-list">
                {recommendedSkills.map((rec, idx) => {
                  const Icon = rec.icon;
                  return (
                    <div className="rec-item" key={idx}>
                      <div className={`rec-icon-wrapper bg-${rec.color}-light`}>
                        <Icon className={`text-${rec.color}`} size={20} />
                      </div>
                      <div className="rec-details">
                        <h4>{rec.name}</h4>
                        <span className="rec-time"><Clock size={14} /> Est. {rec.time}</span>
                      </div>
                      <Link to="/roadmap" className="btn btn-outline btn-sm">Start</Link>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Recent Activities & Career Domain */}
          <div className="dashboard-row grid-cols-2">

            <div className="dash-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="card-header">
                <h3>Recent Activities</h3>
              </div>
              <div className="timeline">
                {activities.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div className="timeline-item" key={idx}>
                      <div className="timeline-icon">
                        <Icon size={16} />
                      </div>
                      <div className="timeline-content">
                        <h4>{activity.title}</h4>
                        <span className="timeline-time">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dash-card domain-card animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="domain-bg"></div>
              <div className="domain-content">
                <div className="domain-icon-wrapper">
                  <Briefcase size={28} className="text-white" />
                </div>
                <h3>Career Domain Insight</h3>
                <h2>{careerGoal}</h2>
                <p>The demand for this role is projected to grow <strong>22%</strong> over the next decade.</p>
                <div className="domain-stats">
                  <div className="d-stat">
                    <span>Active Jobs</span>
                    <strong>12,450+</strong>
                  </div>
                  <div className="d-stat">
                    <span>Avg. Salary</span>
                    <strong>$85k – $120k</strong>
                  </div>
                </div>
                <Link to="/jobs" className="btn btn-primary w-full mt-4 justify-center">
                  Explore Job Matches
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

function ArrowRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
}

export default Dashboard;
