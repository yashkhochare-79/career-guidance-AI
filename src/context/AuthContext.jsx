// ============================================
// AuthContext — Authentication State Management
// ============================================
// Manages user accounts, login/signup, sessions,
// and links each user's profile data to their account.
//
// Usage:
//   import { useAuth } from '../context/AuthContext';
//   const { currentUser, login, signup, logout, isAuthenticated } = useAuth();
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// localStorage keys
const USERS_DB_KEY = 'careerpath_users_db';       // All registered users
const SESSION_KEY = 'careerpath_session';          // Current logged-in user
const REMEMBER_KEY = 'careerpath_remember';        // Remember me flag

// ─── Helper: get all registered users from localStorage ───
const getUsersDB = () => {
  try {
    const data = localStorage.getItem(USERS_DB_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

// ─── Helper: save users DB to localStorage ───
const saveUsersDB = (users) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

// ─── Helper: simple hash for password (NOT production-safe) ───
// In production, passwords are hashed server-side with bcrypt.
// This is a client-side simulation for demonstration only.
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(36);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session
  const [toast, setToast] = useState(null);      // { type: 'success'|'error', message: '' }

  // ─── On mount: restore session from localStorage ───
  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const userData = JSON.parse(session);
        // Verify user still exists in DB
        const users = getUsersDB();
        const exists = users.find(u => u.id === userData.id);
        if (exists) {
          setCurrentUser(userData);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  // ─── Show toast notification ───
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── SIGNUP ───
  const signup = useCallback((fullName, email, password) => {
    const users = getUsersDB();
    const emailLower = email.trim().toLowerCase();

    // Check for duplicate email
    const exists = users.find(u => u.email === emailLower);
    if (exists) {
      showToast('error', 'An account with this email already exists.');
      return { success: false, error: 'duplicate_email' };
    }

    // Create new user account
    const newUser = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      fullName: fullName.trim(),
      email: emailLower,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };

    // Save to "database"
    users.push(newUser);
    saveUsersDB(users);

    // Auto-login after signup
    const sessionData = { id: newUser.id, fullName: newUser.fullName, email: newUser.email };
    setCurrentUser(sessionData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    // Store the signup name for onboarding pre-fill
    localStorage.setItem('careerpath_signup_name', fullName.trim());

    showToast('success', `Welcome, ${fullName.split(' ')[0]}! Account created successfully.`);
    return { success: true, user: sessionData };
  }, [showToast]);

  // ─── LOGIN ───
  const login = useCallback((email, password, rememberMe = false) => {
    const users = getUsersDB();
    const emailLower = email.trim().toLowerCase();

    // Find user by email
    const user = users.find(u => u.email === emailLower);
    if (!user) {
      showToast('error', 'No account found with this email.');
      return { success: false, error: 'user_not_found' };
    }

    // Verify password
    if (user.passwordHash !== simpleHash(password)) {
      showToast('error', 'Incorrect password. Please try again.');
      return { success: false, error: 'wrong_password' };
    }

    // Create session
    const sessionData = { id: user.id, fullName: user.fullName, email: user.email };
    setCurrentUser(sessionData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    // Remember me
    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, 'true');
    }

    showToast('success', `Welcome back, ${user.fullName.split(' ')[0]}!`);
    return { success: true, user: sessionData };
  }, [showToast]);

  // ─── LOGOUT ───
  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    // Note: we do NOT clear the profile data here — 
    // UserContext handles that separately
    showToast('success', 'Logged out successfully.');
  }, [showToast]);

  // ─── Derived state ───
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      loading,
      toast,
      signup,
      login,
      logout,
      showToast,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};

export default AuthContext;
