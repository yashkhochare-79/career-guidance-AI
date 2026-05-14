// ============================================
// UserContext — Per-User Profile Data
// ============================================
// Stores profile/onboarding data linked to each user
// account via their unique user ID from AuthContext.
//
// Each user has their own isolated profile data
// stored in localStorage under their user ID.
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

// Default profile shape
const DEFAULT_PROFILE = {
  fullName: '',
  collegeName: '',
  degree: '',
  branch: '',
  currentYear: '',
  skills: [],
  interests: [],
  certifications: '',
  careerGoal: '',
  experienceLevel: '',
  profileCompleted: false,
  createdAt: null,
  notificationsEnabled: true,
  emailUpdates: true,
  theme: 'light',
};

// ─── Helper: get storage key for a specific user ───
const getStorageKey = (userId) => `careerpath_profile_${userId}`;

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(DEFAULT_PROFILE);

  // Load profile data when currentUser changes (login/logout)
  useEffect(() => {
    if (currentUser?.id) {
      // Load this user's profile from localStorage
      try {
        const key = getStorageKey(currentUser.id);
        const stored = localStorage.getItem(key);
        if (stored) {
          setUser({ ...DEFAULT_PROFILE, ...JSON.parse(stored) });
        } else {
          // New user — pre-fill name from auth account
          setUser({ ...DEFAULT_PROFILE, fullName: currentUser.fullName || '' });
        }
      } catch {
        setUser({ ...DEFAULT_PROFILE, fullName: currentUser.fullName || '' });
      }
    } else {
      // Logged out — reset to defaults
      setUser(DEFAULT_PROFILE);
    }
  }, [currentUser?.id]);

  // Persist profile data whenever it changes (only if logged in)
  useEffect(() => {
    if (currentUser?.id && user !== DEFAULT_PROFILE) {
      const key = getStorageKey(currentUser.id);
      localStorage.setItem(key, JSON.stringify(user));
    }
  }, [user, currentUser?.id]);

  // ─── Update one or more profile fields ───
  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // ─── Set entire profile (after onboarding) ───
  const setProfile = (profileData) => {
    setUser({
      ...DEFAULT_PROFILE,
      ...profileData,
      profileCompleted: true,
      createdAt: profileData.createdAt || new Date().toISOString(),
    });
  };

  // ─── Clear profile (for account deletion) ───
  const clearProfile = () => {
    if (currentUser?.id) {
      localStorage.removeItem(getStorageKey(currentUser.id));
    }
    setUser(DEFAULT_PROFILE);
  };

  const isProfileComplete = user.profileCompleted;

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      setProfile,
      clearProfile,
      isProfileComplete,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a <UserProvider>');
  }
  return context;
};

export default UserContext;
