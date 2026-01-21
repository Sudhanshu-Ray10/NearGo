import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setUpRecaptcha = (elementId) => {
    // We need to import RecaptchaVerifier dynamically or ensure it is available from firebase/auth
    // Ideally this should be passed from the component or initialized here if we import it.
    // However, RecaptchaVerifier is a class from 'firebase/auth'.
    // We will assume the component handles the instance or we export a helper.
    // For simplicity in Context, we'll just expose the auth instance which is needed.
    return auth; 
  };

  const logout = () => {
    // Check if it's a dev user (no uid from firebase or specific flag)
    if (user && user.isDev) {
        setUser(null);
        return Promise.resolve();
    }
    return signOut(auth);
  };

  const devLogin = () => {
      setUser({
          uid: 'dev-user-123',
          phoneNumber: '+919876543210',
          isDev: true
      });
  };

  return (
    <AuthContext.Provider value={{ user, auth, logout, loading, devLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
