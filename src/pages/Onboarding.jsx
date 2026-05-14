import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Save, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import SkillAutocomplete from '../components/common/SkillAutocomplete';
import { useUser } from '../context/UserContext';
import './Onboarding.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const navigate = useNavigate();
  const { setProfile } = useUser();

  // Pre-fill name from signup if available
  const signupName = localStorage.getItem('careerpath_signup_name') || '';

  const [formData, setFormData] = useState({
    fullName: signupName,
    collegeName: '',
    degree: '',
    branch: '',
    currentYear: '',
    skills: [],
    interests: [],
    certifications: '',
    careerGoal: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  // Validation per step
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!formData.fullName.trim()) e.fullName = 'Full Name is required';
      if (!formData.collegeName.trim()) e.collegeName = 'College Name is required';
      if (!formData.degree) e.degree = 'Degree is required';
      if (!formData.branch) e.branch = 'Branch is required';
      if (!formData.currentYear) e.currentYear = 'Year is required';
    } else if (step === 2) {
      if (formData.skills.length === 0) e.skills = 'Add at least one skill';
    } else if (step === 3) {
      if (!formData.careerGoal) e.careerGoal = 'Please select a career goal';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);
  const progressPercent = Math.round((step / totalSteps) * 100);

  const isStepValid = () => {
    if (step === 1) return formData.fullName && formData.collegeName && formData.degree && formData.branch && formData.currentYear;
    if (step === 2) return formData.skills.length > 0;
    if (step === 3) return formData.careerGoal;
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    // Save profile via global context (persists to localStorage automatically)
    setProfile(formData);

    navigate('/dashboard');
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-bg">
        <div className="ob-blob ob-blob-1"></div>
        <div className="ob-blob ob-blob-2"></div>
      </div>

      <div className="onboarding-wrapper">
        {/* Header */}
        <div className="onboarding-header animate-fade-in-up">
          <Sparkles size={24} className="ob-sparkle" />
          <h1>Let's set up your profile</h1>
          <p>This helps us personalize your career roadmap and recommendations.</p>
        </div>

        {/* Progress Bar */}
        <div className="onboarding-progress animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="progress-info">
            <span>Step {step} of {totalSteps}</span>
            <span>{progressPercent}% complete</span>
          </div>
          {/* Step Indicators */}
          <div className="step-indicators">
            {[
              { num: 1, label: 'Academic', icon: GraduationCap },
              { num: 2, label: 'Skills', icon: Sparkles },
              { num: 3, label: 'Career Goal', icon: Briefcase },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.num} className={`step-ind ${step >= s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}>
                  <div className="ind-circle">
                    {step > s.num ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span className="ind-label">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="onboarding-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit}>

            {/* Step 1: Academic Info */}
            {step === 1 && (
              <div className="ob-step-content" key="step1">
                <h2 className="ob-section-title">Academic Profile</h2>
                <p className="ob-section-desc">Tell us about your education background.</p>

                <div className="ob-field">
                  <label>Full Name <span className="required">*</span></label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange}
                    className={`ob-input ${errors.fullName ? 'error' : ''}`} placeholder="e.g. John Doe" />
                  {errors.fullName && <span className="ob-error">{errors.fullName}</span>}
                </div>

                <div className="ob-field">
                  <label>College / University <span className="required">*</span></label>
                  <input name="collegeName" value={formData.collegeName} onChange={handleChange}
                    className={`ob-input ${errors.collegeName ? 'error' : ''}`} placeholder="e.g. State Tech University" />
                  {errors.collegeName && <span className="ob-error">{errors.collegeName}</span>}
                </div>

                <div className="ob-grid-2">
                  <div className="ob-field">
                    <label>Degree <span className="required">*</span></label>
                    <select name="degree" value={formData.degree} onChange={handleChange}
                      className={`ob-input ${errors.degree ? 'error' : ''}`}>
                      <option value="">Select Degree</option>
                      <option>B.Tech / B.E</option>
                      <option>B.Sc</option>
                      <option>BCA</option>
                      <option>M.Tech</option>
                      <option>MCA</option>
                      <option>Other</option>
                    </select>
                    {errors.degree && <span className="ob-error">{errors.degree}</span>}
                  </div>
                  <div className="ob-field">
                    <label>Branch <span className="required">*</span></label>
                    <select name="branch" value={formData.branch} onChange={handleChange}
                      className={`ob-input ${errors.branch ? 'error' : ''}`}>
                      <option value="">Select Branch</option>
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>Electronics</option>
                      <option>Mechanical</option>
                      <option>Other</option>
                    </select>
                    {errors.branch && <span className="ob-error">{errors.branch}</span>}
                  </div>
                </div>

                <div className="ob-field">
                  <label>Current Year <span className="required">*</span></label>
                  <select name="currentYear" value={formData.currentYear} onChange={handleChange}
                    className={`ob-input ${errors.currentYear ? 'error' : ''}`}>
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>Graduated</option>
                  </select>
                  {errors.currentYear && <span className="ob-error">{errors.currentYear}</span>}
                </div>
              </div>
            )}

            {/* Step 2: Skills & Interests */}
            {step === 2 && (
              <div className="ob-step-content" key="step2">
                <h2 className="ob-section-title">Skills & Interests</h2>
                <p className="ob-section-desc">Add your technical skills. Start typing to see suggestions.</p>

                <div className="ob-field">
                  <label>Your Skills <span className="required">*</span></label>
                  <SkillAutocomplete
                    selectedSkills={formData.skills}
                    onChange={(skills) => {
                      setFormData({ ...formData, skills });
                      if (errors.skills) setErrors({ ...errors, skills: null });
                    }}
                    placeholder='Type a skill (e.g. Python, React)...'
                    error={errors.skills}
                  />
                </div>

                <div className="ob-field">
                  <label>Interests <span className="optional">(optional)</span></label>
                  <SkillAutocomplete
                    selectedSkills={formData.interests}
                    onChange={(interests) => setFormData({ ...formData, interests })}
                    placeholder='Type an interest (e.g. Machine Learning)...'
                  />
                </div>

                <div className="ob-field">
                  <label>Certifications <span className="optional">(optional — <button type="button" className="skip-link" onClick={nextStep}>skip</button>)</span></label>
                  <textarea name="certifications" value={formData.certifications} onChange={handleChange}
                    className="ob-input ob-textarea" placeholder="e.g. AWS Cloud Practitioner, Google Data Analytics" rows="3" />
                </div>
              </div>
            )}

            {/* Step 3: Career Goal */}
            {step === 3 && (
              <div className="ob-step-content" key="step3">
                <h2 className="ob-section-title">Career Goal</h2>
                <p className="ob-section-desc">What role are you aiming for? We'll build your roadmap around this.</p>

                <div className="ob-field">
                  <label>Preferred Career / Job Role <span className="required">*</span></label>
                  <div className="career-goal-grid">
                    {[
                      'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
                      'Data Analyst', 'Data Scientist', 'AI / ML Engineer',
                      'DevOps Engineer', 'Cybersecurity Analyst', 'UI/UX Designer',
                      'Mobile App Developer', 'Cloud Engineer', 'Product Manager'
                    ].map(role => (
                      <button
                        key={role}
                        type="button"
                        className={`goal-option ${formData.careerGoal === role ? 'selected' : ''}`}
                        onClick={() => {
                          setFormData({ ...formData, careerGoal: role });
                          if (errors.careerGoal) setErrors({ ...errors, careerGoal: null });
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  {errors.careerGoal && <span className="ob-error">{errors.careerGoal}</span>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="ob-actions">
              {step > 1 && (
                <button type="button" className="btn btn-secondary ob-btn" onClick={prevStep}>
                  <ChevronLeft size={18} /> Back
                </button>
              )}
              {step < totalSteps ? (
                <button type="button" className={`btn btn-primary ob-btn ml-auto ${!isStepValid() ? 'btn-disabled' : ''}`}
                  onClick={nextStep} disabled={!isStepValid()}>
                  Continue <ChevronRight size={18} />
                </button>
              ) : (
                <button type="submit" className={`btn btn-primary ob-btn ml-auto ${!isStepValid() ? 'btn-disabled' : ''}`}
                  disabled={!isStepValid()}>
                  <Save size={18} /> Complete Setup
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
