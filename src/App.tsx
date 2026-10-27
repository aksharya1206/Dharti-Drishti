import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/common/Toast';

export const App: React.FC = () => {
  const { user } = useApp();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // CRITICAL REQUIREMENT: LOGIN FIRST.
  // The FIRST screen MUST be a professional authentication page.
  // Do not open dashboard, landing page, or analytics page before authentication.
  if (!user || !user.isAuthenticated) {
    return (
      <>
        {authView === 'login' ? (
          <LoginScreen onSwitchToSignUp={() => setAuthView('signup')} />
        ) : (
          <SignUpScreen onSwitchToLogin={() => setAuthView('login')} />
        )}
        <ToastContainer />
      </>
    );
  }

  // Once authenticated, render the production-quality dashboard application
  return <AppLayout />;
};

export default App;

