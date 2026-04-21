
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth as useAuthHook } from '@/hooks/useAuth';
import { useActivityLogger } from '@/hooks/useActivityLogger';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  const { updateLastLogin } = useActivityLogger();

  // Update last login when user authenticates
  useEffect(() => {
    if (auth.user) {
      updateLastLogin(auth.user.id);
    }
  }, [auth.user, updateLastLogin]);

  return (
    <AuthContext.Provider value={{ 
      user: auth.user,
      loading: auth.loading,
      error: auth.error,
      signUp: auth.signUp,
      signIn: auth.signIn,
      signOut: auth.signOut,
      logout: auth.signOut,
	      resetPassword: auth.resetPassword,
	      updatePassword: auth.updatePassword,
	      updateUser: auth.updateUser,
	      resendVerificationEmail: auth.resendVerificationEmail,
      isAuthenticated: !!auth.user,
      isAdmin: auth.user?.app_metadata?.role === 'admin' || auth.user?.user_metadata?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
