import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import SkillAutocomplete from '../components/common/SkillAutocomplete';
import {
  User, GraduationCap, Target, Lock, Bell, Palette, LogOut, Trash2,
  Save, Camera, ChevronRight, Check, Moon, Sun
} from 'lucide-react';
import './Settings.css';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'skills', label: 'Skills', icon: Target },
  { id: 'career', label: 'Career Goal', icon: GraduationCap },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'danger', label: 'Account', icon: Trash2 },
];

const Settings = () => {
  const { user, updateUser, clearProfile } = useUser();
  const { logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Local editable copies of user data
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || '',
    collegeName: user.collegeName || '',
    degree: user.degree || '',
    branch: user.branch || '',
    currentYear: user.currentYear || '',
  });

  const [skills, setSkills] = useState(user.skills || []);
  const [interests, setInterests] = useState(user.interests || []);
  const [careerGoal, setCareerGoal] = useState(user.careerGoal || '');

  const [notifications, setNotifications] = useState({
    emailUpdates: user.emailUpdates !== false,
    jobAlerts: true,
    weeklyReport: true,
    skillReminders: true,
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const showSavedToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveProfile = () => {
    updateUser(profileData);
    showSavedToast();
  };

  const saveSkills = () => {
    updateUser({ skills, interests });
    showSavedToast();
  };

  const saveCareerGoal = () => {
    updateUser({ careerGoal });
    showSavedToast();
  };

  const saveNotifications = () => {
    updateUser({ emailUpdates: notifications.emailUpdates });
    showSavedToast();
  };

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <div className="settings-container">
        {/* Toast */}
        {saved && (
          <div className="save-toast animate-fade-in-up">
            <Check size={18} /> Changes saved successfully!
          </div>
        )}

        <h1 className="page-title animate-fade-in-up">Settings</h1>
        <p className="page-subtitle animate-fade-in-up">Manage your profile, skills, and preferences.</p>

        <div className="settings-layout">
          {/* Sidebar Tabs */}
          <div className="settings-sidebar animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {SECTIONS.map(sec => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  className={`settings-tab ${activeSection === sec.id ? 'active' : ''} ${sec.id === 'danger' ? 'danger-tab' : ''}`}
                  onClick={() => setActiveSection(sec.id)}
                >
                  <Icon size={18} />
                  <span>{sec.label}</span>
                  <ChevronRight size={16} className="tab-chevron" />
                </button>
              );
            })}
          </div>

          {/* Content Panel */}
          <div className="settings-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            {/* ─── Profile Section ─── */}
            {activeSection === 'profile' && (
              <div className="settings-section" key="profile">
                <h2>Update Profile</h2>
                <p className="section-desc">Edit your personal and academic details.</p>

                <div className="avatar-upload">
                  <div className="avatar-circle">{(profileData.fullName || 'U').charAt(0)}</div>
                  <button className="avatar-edit-btn"><Camera size={16} /> Change Photo</button>
                </div>

                <div className="form-grid">
                  <div className="s-field">
                    <label>Full Name</label>
                    <input name="fullName" value={profileData.fullName} onChange={handleProfileChange} className="s-input" />
                  </div>
                  <div className="s-field">
                    <label>College / University</label>
                    <input name="collegeName" value={profileData.collegeName} onChange={handleProfileChange} className="s-input" />
                  </div>
                  <div className="s-field">
                    <label>Degree</label>
                    <select name="degree" value={profileData.degree} onChange={handleProfileChange} className="s-input">
                      <option value="">Select</option>
                      <option>B.Tech / B.E</option>
                      <option>B.Sc</option>
                      <option>BCA</option>
                      <option>M.Tech</option>
                      <option>MCA</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="s-field">
                    <label>Branch</label>
                    <select name="branch" value={profileData.branch} onChange={handleProfileChange} className="s-input">
                      <option value="">Select</option>
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>Electronics</option>
                      <option>Mechanical</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="s-field">
                    <label>Current Year</label>
                    <select name="currentYear" value={profileData.currentYear} onChange={handleProfileChange} className="s-input">
                      <option value="">Select</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Graduated</option>
                    </select>
                  </div>
                </div>

                <button className="btn btn-primary save-btn-settings" onClick={saveProfile}>
                  <Save size={18} /> Save Profile
                </button>
              </div>
            )}

            {/* ─── Skills Section ─── */}
            {activeSection === 'skills' && (
              <div className="settings-section" key="skills">
                <h2>Edit Skills & Interests</h2>
                <p className="section-desc">Add or remove your technical skills. Changes update all pages automatically.</p>

                <div className="s-field">
                  <label>Your Skills</label>
                  <SkillAutocomplete
                    selectedSkills={skills}
                    onChange={setSkills}
                    placeholder="Type a skill..."
                  />
                </div>

                <div className="s-field" style={{ marginTop: '1.5rem' }}>
                  <label>Your Interests</label>
                  <SkillAutocomplete
                    selectedSkills={interests}
                    onChange={setInterests}
                    placeholder="Type an interest..."
                  />
                </div>

                <button className="btn btn-primary save-btn-settings" onClick={saveSkills}>
                  <Save size={18} /> Save Skills
                </button>
              </div>
            )}

            {/* ─── Career Goal ─── */}
            {activeSection === 'career' && (
              <div className="settings-section" key="career">
                <h2>Change Career Goal</h2>
                <p className="section-desc">Your roadmap and recommendations are built around this selection.</p>

                <div className="career-goal-grid-settings">
                  {[
                    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                    'Data Analyst', 'Data Scientist', 'AI / ML Engineer',
                    'DevOps Engineer', 'Cybersecurity Analyst', 'UI/UX Designer',
                    'Mobile App Developer', 'Cloud Engineer', 'Product Manager'
                  ].map(role => (
                    <button
                      key={role}
                      className={`goal-option-settings ${careerGoal === role ? 'selected' : ''}`}
                      onClick={() => setCareerGoal(role)}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <button className="btn btn-primary save-btn-settings" onClick={saveCareerGoal}>
                  <Save size={18} /> Save Career Goal
                </button>
              </div>
            )}

            {/* ─── Password ─── */}
            {activeSection === 'password' && (
              <div className="settings-section" key="password">
                <h2>Change Password</h2>
                <p className="section-desc">Update your account password.</p>

                <div className="form-grid single">
                  <div className="s-field">
                    <label>Current Password</label>
                    <input type="password" className="s-input" placeholder="Enter current password" />
                  </div>
                  <div className="s-field">
                    <label>New Password</label>
                    <input type="password" className="s-input" placeholder="Enter new password" />
                  </div>
                  <div className="s-field">
                    <label>Confirm New Password</label>
                    <input type="password" className="s-input" placeholder="Confirm new password" />
                  </div>
                </div>

                <button className="btn btn-primary save-btn-settings" onClick={showSavedToast}>
                  <Lock size={18} /> Update Password
                </button>
              </div>
            )}

            {/* ─── Notifications ─── */}
            {activeSection === 'notifications' && (
              <div className="settings-section" key="notifications">
                <h2>Notification Preferences</h2>
                <p className="section-desc">Control which notifications you receive.</p>

                <div className="toggle-list">
                  {[
                    { key: 'emailUpdates', label: 'Email Updates', desc: 'Receive important updates via email' },
                    { key: 'jobAlerts', label: 'New Job Alerts', desc: 'Get notified when new matching jobs are posted' },
                    { key: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Summary of your weekly activity and progress' },
                    { key: 'skillReminders', label: 'Skill Practice Reminders', desc: 'Daily reminders to practice recommended skills' },
                  ].map(item => (
                    <div className="toggle-item" key={item.key}>
                      <div>
                        <h4>{item.label}</h4>
                        <p>{item.desc}</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary save-btn-settings" onClick={saveNotifications}>
                  <Save size={18} /> Save Preferences
                </button>
              </div>
            )}

            {/* ─── Appearance ─── */}
            {activeSection === 'appearance' && (
              <div className="settings-section" key="appearance">
                <h2>Appearance</h2>
                <p className="section-desc">Customize how CareerPath AI looks.</p>

                <div className="theme-options">
                  <button className="theme-card active">
                    <Sun size={28} />
                    <span>Light Mode</span>
                    <Check size={16} className="theme-check" />
                  </button>
                  <button className="theme-card">
                    <Moon size={28} />
                    <span>Dark Mode</span>
                    <span className="coming-soon">Coming Soon</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── Danger Zone ─── */}
            {activeSection === 'danger' && (
              <div className="settings-section" key="danger">
                <h2>Account Actions</h2>
                <p className="section-desc">Manage your account access and data.</p>

                <div className="danger-actions">
                  <div className="danger-card logout-card">
                    <div>
                      <h3><LogOut size={18} /> Log Out</h3>
                      <p>Sign out of your CareerPath AI account.</p>
                    </div>
                    <button className="btn btn-outline btn-danger-outline" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>

                  <div className="danger-card delete-card">
                    <div>
                      <h3><Trash2 size={18} /> Delete Account</h3>
                      <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button className="btn btn-danger" onClick={() => { clearProfile(); authLogout(); navigate('/login'); }}>
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
