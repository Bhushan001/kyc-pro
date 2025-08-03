import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import SignupAdminPage from './components/SignupAdminPage';
import SignupTenantAdminPage from './components/SignupTenantAdminPage';
import SignupUserPage from './components/SignupUserPage';
import Hub from './components/dashboards/Hub';
import Console from './components/dashboards/Console';
import Workspace from './components/dashboards/Workspace';

export type UserRole = 'platform_admin' | 'platform_tenant_admin' | 'platform_user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  tenantId?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock authentication check
    const savedUser = localStorage.getItem('kyc-pro-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('kyc-pro-user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kyc-pro-user');
  };

  const getDashboardComponent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'platform_admin':
        return <Hub user={user} onLogout={handleLogout} />;
      case 'platform_tenant_admin':
        return <Console user={user} onLogout={handleLogout} />;
      case 'platform_user':
        return <Workspace user={user} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
          />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup/platform-admin" 
            element={user ? <Navigate to="/dashboard" replace /> : <SignupAdminPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup/tenant-admin" 
            element={user ? <Navigate to="/dashboard" replace /> : <SignupTenantAdminPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup/user" 
            element={user ? <Navigate to="/dashboard" replace /> : <SignupUserPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? getDashboardComponent() : <Navigate to="/auth" replace />} 
          />
          {/* Catch-all route for unmatched paths */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;