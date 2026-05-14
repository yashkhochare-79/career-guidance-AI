import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthContainer from '../components/common/AuthContainer';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Mail, Lock, LogIn, Loader } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
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
    // Clear global error when user starts typing
    if (errors.global) {
      setErrors({ ...errors, global: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    const result = login(formData.email, formData.password, rememberMe);

    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else if (result.error === 'user_not_found') {
      setErrors({ email: 'No account found with this email.' });
    } else if (result.error === 'wrong_password') {
      setErrors({ password: 'Incorrect password. Please try again.' });
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login — requires backend OAuth integration');
  };

  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Log in to continue your career journey."
      illustrationUrl="/hero_illustration.png"
    >
      <div className="auth-header">
        <h3 className="auth-title">Log In</h3>
        <p className="auth-subtitle">Welcome back! Enter your credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
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
          placeholder="Enter your password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="auth-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="custom-checkbox"></span>
            Remember me
          </label>
          <a href="#" className="forgot-password">Forgot Password?</a>
        </div>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (
            <><Loader size={18} className="spin" /> Logging in...</>
          ) : (
            <>Log In <LogIn size={18} /></>
          )}
        </Button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <Button type="button" variant="google" onClick={handleGoogleLogin}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" />
          Continue with Google
        </Button>
      </form>

      <div className="auth-footer">
        <p>Don't have an account? <Link to="/signup" className="auth-link">Create Account</Link></p>
      </div>
    </AuthContainer>
  );
};

export default Login;
