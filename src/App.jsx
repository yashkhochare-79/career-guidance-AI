import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Toast from './components/common/Toast';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import SkillAnalysis from './pages/SkillAnalysis';
import Roadmap from './pages/Roadmap';
import Jobs from './pages/Jobs';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Settings from './pages/Settings';

// Inner component that can access auth context for Toast
function AppContent() {
  const { toast, showToast } = useAuth();

  return (
    <>
      {/* Global toast notifications */}
      <Toast toast={toast} onClose={() => showToast(null)} />

      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Onboarding — requires auth but not full profile */}
          <Route path="/onboarding" element={
            <ProtectedRoute><Onboarding /></ProtectedRoute>
          } />

          {/* Protected routes — require authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/skills" element={
            <ProtectedRoute><SkillAnalysis /></ProtectedRoute>
          } />
          <Route path="/roadmap" element={
            <ProtectedRoute><Roadmap /></ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute><Jobs /></ProtectedRoute>
          } />
          <Route path="/resume" element={
            <ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute><Settings /></ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
