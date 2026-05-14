import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthContainer from '../components/common/AuthContainer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { User, Mail, Lock, UserPlus, Loader } from 'lucide-react';
import './Auth.css';

const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    // Full name
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';

    // Email format
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Strong password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Include at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Include at least one number';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    // Simulate slight delay for UX
    await new Promise(r => setTimeout(r, 600));

    const result = signup(formData.fullName, formData.email, formData.password);

    setIsLoading(false);

    if (result.success) {
      // Redirect to onboarding after successful signup
      navigate('/onboarding');
    } else if (result.error === 'duplicate_email') {
      setErrors({ email: 'This email is already registered. Try logging in.' });
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup — requires backend OAuth integration');
  };

  return (
    <AuthContainer
      title="Start Your Journey"
      subtitle="Create an account and discover your true potential."
      illustrationUrl="/hero_illustration.png"
    >
      <div className="auth-header">
        <h3 className="auth-title">Create an Account</h3>
        <p className="auth-subtitle">Sign up to get personalized career guidance.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <Input
          label="Full Name"
          type="text"
          id="fullName"
          placeholder="Enter your full name"
          icon={User}
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        <Input
          label="Email Address"
          type="email"
          id="email"
          placeholder="Enter your email"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          id="password"
          placeholder="Create a strong password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          placeholder="Confirm your password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (
            <><Loader size={18} className="spin" /> Creating Account...</>
          ) : (
            <>Sign Up <UserPlus size={18} /></>
          )}
        </Button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <Button type="button" variant="google" onClick={handleGoogleSignup}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
          Sign up with Google
        </Button>
      </form>

      <div className="auth-footer">
        <p>Already have an account? <Link to="/login" className="auth-link">Log in</Link></p>
      </div>
    </AuthContainer>
  );
};

export default Signup;
