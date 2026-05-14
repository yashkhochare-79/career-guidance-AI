import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useUser } from '../context/UserContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Target, CheckCircle2, AlertCircle, TrendingUp, BookOpen, ChevronDown } from 'lucide-react';
import './SkillAnalysis.css';

// Role requirements with skill-level detail
const ROLE_REQUIREMENTS = {
  'Frontend Developer': {
    required: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git'],
    chartSkills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'State Mgmt', 'Testing'],
    chartTargets: [95, 90, 85, 80, 75, 60],
  },
  'Backend Developer': {
    required: ['Node.js', 'Python', 'SQL', 'REST APIs', 'Docker', 'Git'],
    chartSkills: ['Node.js', 'Databases', 'REST APIs', 'Docker', 'Microservices', 'Caching'],
    chartTargets: [90, 85, 90, 70, 65, 60],
  },
  'Data Analyst': {
    required: ['SQL', 'Excel', 'Python', 'Pandas', 'Tableau', 'Statistics'],
    chartSkills: ['SQL', 'Python', 'Visualization', 'Statistics', 'Excel', 'ML Basics'],
    chartTargets: [95, 90, 85, 80, 85, 40],
  },
  'AI Engineer': {
    required: ['Python', 'PyTorch', 'Linear Algebra', 'Deep Learning', 'NLP', 'Git'],
    chartSkills: ['Python', 'PyTorch/TF', 'Math', 'NLP/CV', 'MLOps', 'Cloud'],
    chartTargets: [95, 90, 85, 80, 70, 75],
  },
};

const SkillAnalysis = () => {
  const { user } = useUser();
  const userSkills = user.skills || [];
  const userSkillsLower = userSkills.map(s => s.toLowerCase());

  // Default to the user's career goal if it matches a role
  const defaultRole = Object.keys(ROLE_REQUIREMENTS).find(
    r => r.toLowerCase() === (user.careerGoal || '').toLowerCase()
  ) || 'Frontend Developer';

  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const targetJobs = Object.keys(ROLE_REQUIREMENTS);
  const role = ROLE_REQUIREMENTS[selectedRole];

  // Compute matched/missing skills dynamically from user's actual skills
  const analysis = useMemo(() => {
    const matched = role.required.filter(s => userSkillsLower.includes(s.toLowerCase()));
    const missing = role.required.filter(s => !userSkillsLower.includes(s.toLowerCase()));
    const matchPct = role.required.length > 0
      ? Math.round((matched.length / role.required.length) * 100) : 0;

    // Build radar chart data: user score based on whether they have the skill
    const radarData = role.chartSkills.map((label, i) => ({
      subject: label,
      target: role.chartTargets[i],
      user: matched.length > 0
        ? Math.round((matched.length / role.required.length) * role.chartTargets[i])
        : Math.round(Math.random() * 30),
    }));

    // Recommendations based on missing skills
    const recommendations = missing.slice(0, 4).map(s => `Learn ${s} through hands-on projects and courses.`);
    if (matched.length > 0) {
      recommendations.push(`Deepen your ${matched[0]} skills with advanced concepts.`);
    }

    return { matched, missing, matchPct, radarData, recommendations };
  }, [selectedRole, userSkillsLower.join(',')]);

  return (
    <DashboardLayout>
      <div className="skill-analysis-container">
        <div className="analysis-header animate-fade-in-up">
          <div>
            <h1 className="page-title">Skill Gap Analysis</h1>
            <p className="page-subtitle">Compare your current skillset with industry requirements.</p>
          </div>
          <div className="role-selector">
            <span className="selector-label">Target Role:</span>
            <div className="custom-select-wrapper">
              <select className="role-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                {targetJobs.map(job => <option key={job} value={job}>{job}</option>)}
              </select>
              <ChevronDown className="select-icon" size={18} />
            </div>
          </div>
        </div>

        <div className="analysis-grid">
          {/* Match Score & Radar Chart */}
          <div className="analysis-col-left">
            <div className="analysis-card match-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-header"><h3>Overall Match</h3></div>
              <div className="match-content">
                <div className="match-chart">
                  <div className="circular-progress lg-progress" style={{ '--progress': `${analysis.matchPct}%` }}>
                    <div className="inner-circle">
                      <span className="progress-value">{analysis.matchPct}%</span>
                    </div>
                  </div>
                </div>
                <div className="match-info">
                  <h4>{analysis.matchPct >= 70 ? 'Strong Match!' : analysis.matchPct >= 40 ? 'Moderate Match' : 'Gap Identified'}</h4>
                  <p>You have a {analysis.matchPct}% skill overlap with the requirements for a <strong>{selectedRole}</strong>.</p>
                </div>
              </div>
            </div>

            <div className="analysis-card radar-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-header"><h3>Skill Comparison Chart</h3></div>
              <div className="radar-container">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analysis.radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Your Skills" dataKey="user" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.5} />
                    <Radar name="Required Level" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    <RechartsTooltip />
                    <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Missing Skills & Action Plan */}
          <div className="analysis-col-right">
            <div className="analysis-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-header">
                <h3>Skills to Acquire</h3>
                <span className="badge badge-warning">{analysis.missing.length} Missing</span>
              </div>
              <div className="missing-skills-list">
                {analysis.missing.length > 0 ? analysis.missing.map((skill, idx) => (
                  <div className="missing-skill-item" key={idx}>
                    <div className="ms-left">
                      <div className="ms-icon-wrapper bg-red-light">
                        <AlertCircle className="text-red" size={18} />
                      </div>
                      <div className="ms-details">
                        <h4>{skill}</h4>
                        <span className="importance text-red">High Priority</span>
                      </div>
                    </div>
                    <div className="ms-right">
                      <span className="ms-time">{2 + idx * 2} weeks</span>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: '#10B981', fontWeight: 600, padding: '1rem 0' }}>
                    🎉 You have all the required skills for this role!
                  </p>
                )}
              </div>
            </div>

            <div className="analysis-card action-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="card-header"><h3>Action Plan Recommendations</h3></div>
              <div className="recommendation-list">
                {analysis.recommendations.map((rec, idx) => (
                  <div className="rec-item-card" key={idx}>
                    <div className="rec-number">{idx + 1}</div>
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="analysis-card current-skills-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="card-header"><h3>Your Current Skills</h3></div>
              <div className="tags-wrapper">
                {userSkills.length > 0 ? userSkills.map(skill => (
                  <span key={skill} className={`tag ${analysis.matched.map(s => s.toLowerCase()).includes(skill.toLowerCase()) ? 'tag-success' : 'tag'}`}>
                    {analysis.matched.map(s => s.toLowerCase()).includes(skill.toLowerCase()) && <CheckCircle2 size={14} />}
                    {skill}
                  </span>
                )) : (
                  <p style={{ color: 'var(--color-gray)' }}>No skills added yet. Complete your profile to see analysis.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillAnalysis;
