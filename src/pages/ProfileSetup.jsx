import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Check, X, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    collegeName: '',
    degree: '',
    branch: '',
    currentYear: '',
    skills: [],
    interests: [],
    certifications: '',
    experienceLevel: '',
    preferredDomain: ''
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  // Tag Input Handlers
  const handleAddTag = (e, field, value, setter) => {
    e.preventDefault();
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setter('');
    }
  };

  const handleRemoveTag = (field, tagToRemove) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyDown = (e, field, value, setter) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e, field, value, setter);
    }
  };

  // Validation
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full Name is required';
      if (!formData.collegeName) newErrors.collegeName = 'College Name is required';
      if (!formData.degree) newErrors.degree = 'Degree is required';
      if (!formData.branch) newErrors.branch = 'Branch is required';
      if (!formData.currentYear) newErrors.currentYear = 'Current Year is required';
    } else if (step === 2) {
      if (formData.skills.length === 0) newErrors.skills = 'Please add at least one skill';
    } else if (step === 3) {
      if (!formData.experienceLevel) newErrors.experienceLevel = 'Experience Level is required';
      if (!formData.preferredDomain) newErrors.preferredDomain = 'Preferred Domain is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Profile Data Saved:', formData);
      navigate('/dashboard'); // or show success message
    }
  };

  return (
    <DashboardLayout>
      <div className="profile-setup-container">
        <div className="page-header">
          <h1 className="page-title">Profile Setup</h1>
          <p className="page-subtitle">Tell us about yourself so we can personalize your roadmap.</p>
        </div>

        <div className="setup-card card">
          {/* Progress Indicator */}
          <div className="stepper">
            {[1, 2, 3].map((num) => (
              <div key={num} className={`step ${step >= num ? 'active' : ''} ${step > num ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > num ? <Check size={16} /> : num}
                </div>
                <span className="step-label">
                  {num === 1 ? 'Academic' : num === 2 ? 'Skills' : 'Goals'}
                </span>
                {num < 3 && <div className="step-line"></div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="setup-form">
            
            {/* Step 1: Academic Profile */}
            {step === 1 && (
              <div className="form-section animate-fade-in-up">
                <h3 className="section-heading">Academic Profile</h3>
                
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    className={`input-field ${errors.fullName ? 'has-error' : ''}`}
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="John Doe" 
                  />
                  {errors.fullName && <span className="input-error">{errors.fullName}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">College / University Name</label>
                  <input 
                    type="text" 
                    name="collegeName" 
                    className={`input-field ${errors.collegeName ? 'has-error' : ''}`}
                    value={formData.collegeName} 
                    onChange={handleChange} 
                    placeholder="State University" 
                  />
                  {errors.collegeName && <span className="input-error">{errors.collegeName}</span>}
                </div>

                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Degree</label>
                    <select 
                      name="degree" 
                      className={`input-field ${errors.degree ? 'has-error' : ''}`}
                      value={formData.degree} 
                      onChange={handleChange}
                    >
                      <option value="">Select Degree</option>
                      <option value="B.Tech">B.Tech / B.E</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="BCA">BCA</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MCA">MCA</option>
                    </select>
                    {errors.degree && <span className="input-error">{errors.degree}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Branch / Specialization</label>
                    <select 
                      name="branch" 
                      className={`input-field ${errors.branch ? 'has-error' : ''}`}
                      value={formData.branch} 
                      onChange={handleChange}
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.branch && <span className="input-error">{errors.branch}</span>}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Current Year of Study</label>
                  <select 
                    name="currentYear" 
                    className={`input-field ${errors.currentYear ? 'has-error' : ''}`}
                    value={formData.currentYear} 
                    onChange={handleChange}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                  {errors.currentYear && <span className="input-error">{errors.currentYear}</span>}
                </div>
              </div>
            )}

            {/* Step 2: Skills & Interests */}
            {step === 2 && (
              <div className="form-section animate-fade-in-up">
                <h3 className="section-heading">Skills & Certifications</h3>
                
                <div className="input-group">
                  <label className="input-label">Skills (Press Enter or Add)</label>
                  <div className="tag-input-container">
                    <input 
                      type="text" 
                      className={`input-field tag-input ${errors.skills ? 'has-error' : ''}`}
                      value={currentSkill} 
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'skills', currentSkill, setCurrentSkill)}
                      placeholder="e.g. Python, React, Data Analysis" 
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline tag-add-btn"
                      onClick={(e) => handleAddTag(e, 'skills', currentSkill, setCurrentSkill)}
                    >
                      Add
                    </button>
                  </div>
                  {errors.skills && <span className="input-error">{errors.skills}</span>}
                  <div className="tags-wrapper">
                    {formData.skills.map(skill => (
                      <span key={skill} className="tag">
                        {skill} <button type="button" onClick={() => handleRemoveTag('skills', skill)}><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Interests (Optional)</label>
                  <div className="tag-input-container">
                    <input 
                      type="text" 
                      className="input-field tag-input"
                      value={currentInterest} 
                      onChange={(e) => setCurrentInterest(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'interests', currentInterest, setCurrentInterest)}
                      placeholder="e.g. Machine Learning, UI/UX" 
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline tag-add-btn"
                      onClick={(e) => handleAddTag(e, 'interests', currentInterest, setCurrentInterest)}
                    >
                      Add
                    </button>
                  </div>
                  <div className="tags-wrapper">
                    {formData.interests.map(interest => (
                      <span key={interest} className="tag tag-secondary">
                        {interest} <button type="button" onClick={() => handleRemoveTag('interests', interest)}><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Certifications (Optional)</label>
                  <textarea 
                    name="certifications" 
                    className="input-field textarea-field"
                    value={formData.certifications} 
                    onChange={handleChange} 
                    placeholder="List your certifications (e.g. AWS Certified Cloud Practitioner)" 
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Career Goals */}
            {step === 3 && (
              <div className="form-section animate-fade-in-up">
                <h3 className="section-heading">Career Goals</h3>
                
                <div className="input-group">
                  <label className="input-label">Experience Level</label>
                  <select 
                    name="experienceLevel" 
                    className={`input-field ${errors.experienceLevel ? 'has-error' : ''}`}
                    value={formData.experienceLevel} 
                    onChange={handleChange}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Beginner">Beginner (No internship experience)</option>
                    <option value="Intermediate">Intermediate (1-2 internships/projects)</option>
                    <option value="Advanced">Advanced (Multiple internships, strong portfolio)</option>
                  </select>
                  {errors.experienceLevel && <span className="input-error">{errors.experienceLevel}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Preferred Career Domain</label>
                  <select 
                    name="preferredDomain" 
                    className={`input-field ${errors.preferredDomain ? 'has-error' : ''}`}
                    value={formData.preferredDomain} 
                    onChange={handleChange}
                  >
                    <option value="">Select Domain</option>
                    <option value="Software Development">Software Development (SDE)</option>
                    <option value="Data Science & ML">Data Science & Machine Learning</option>
                    <option value="Cloud Computing">Cloud Computing & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Product Management">Product Management</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                  {errors.preferredDomain && <span className="input-error">{errors.preferredDomain}</span>}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="btn-prev">
                  <ChevronLeft size={18} /> Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button type="button" variant="primary" onClick={nextStep} className="btn-next ml-auto">
                  Next Step <ChevronRight size={18} />
                </Button>
              ) : (
                <Button type="submit" variant="primary" className="btn-save ml-auto">
                  <Save size={18} /> Save Profile
                </Button>
              )}
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSetup;
