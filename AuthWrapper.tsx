import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../hooks/useAuth';

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginForm
        onLogin={login}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    ) : (
      <RegisterForm
        onRegister={register}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  return <>{children}</>;
};