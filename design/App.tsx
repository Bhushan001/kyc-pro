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
  assignedApplications?: string[];
}

export interface Application {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  isHighlighted?: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  type: string;
  industry: string;
  country: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  description?: string;
  subscribedApplications: string[];
  userLimit: string;
  dataRetention: string;
  complianceLevel: string;
  customDomain?: string;
  ssoEnabled: boolean;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  tenantAdminId?: string;
  users: string[];
  monthlyRevenue: number;
}

export interface UserApplicationAccess {
  userId: string;
  applicationIds: string[];
  tenantId: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userApplicationAccess, setUserApplicationAccess] = useState<UserApplicationAccess[]>([]);

  const applications: Application[] = [
    {
      id: 'ekyc',
      name: 'E-KYC',
      description: 'Digital Know Your Customer verification with AI-powered document processing',
      monthlyPrice: 499,
      features: ['Document OCR', 'Biometric Verification', 'AI Risk Assessment', 'Real-time Validation'],
      isHighlighted: true
    },
    {
      id: 'sop',
      name: 'Standard Operating Procedures',
      description: 'Automated workflow management and compliance tracking',
      monthlyPrice: 299,
      features: ['Workflow Automation', 'Compliance Tracking', 'Audit Trails']
    },
    {
      id: 'market-maps',
      name: 'Market Intelligence',
      description: 'Advanced market analysis and customer segmentation tools',
      monthlyPrice: 399,
      features: ['Market Analysis', 'Customer Segmentation', 'Risk Profiling']
    },
    {
      id: 'iam',
      name: 'Identity & Access Management',
      description: 'Comprehensive IAM solution with role-based access control',
      monthlyPrice: 199,
      features: ['Role-based Access', 'SSO Integration', 'Multi-factor Auth']
    },
    {
      id: 'api-workflows',
      name: 'API Workflow Engine',
      description: 'Powerful API orchestration and workflow automation',
      monthlyPrice: 349,
      features: ['API Orchestration', 'Workflow Builder', 'Integration Hub']
    }
  ];

  useEffect(() => {
    // Initialize mock data
    const mockUsers: User[] = [
      { id: '1', email: 'admin@kycpro.com', role: 'platform_admin', name: 'Platform Admin' },
      { id: '2', email: 'tenant.admin@icici.com', role: 'platform_tenant_admin', name: 'Rajesh Kumar', tenantId: 'icici-bank' },
      { id: '3', email: 'user1@icici.com', role: 'platform_user', name: 'Priya Sharma', tenantId: 'icici-bank', assignedApplications: ['ekyc', 'sop'] },
      { id: '4', email: 'user2@icici.com', role: 'platform_user', name: 'Amit Singh', tenantId: 'icici-bank', assignedApplications: ['ekyc'] },
      { id: '5', email: 'john.doe@techcorp.com', role: 'platform_tenant_admin', name: 'John Doe', tenantId: 'techcorp' },
      { id: '6', email: 'sarah@techcorp.com', role: 'platform_user', name: 'Sarah Wilson', tenantId: 'techcorp', assignedApplications: ['ekyc', 'iam'] },
      { id: '7', email: 'manager@fintech.com', role: 'platform_tenant_admin', name: 'Alex Johnson' },
      { id: '8', email: 'user@healthcare.com', role: 'platform_user', name: 'Dr. Emily Chen' }
    ];

    const mockTenants: Tenant[] = [
      {
        id: 'icici-bank',
        name: 'ICICI Bank',
        type: 'bank',
        industry: 'banking',
        country: 'india',
        contactEmail: 'admin@icicibank.com',
        contactPhone: '+91 22 2653 1414',
        website: 'https://www.icicibank.com',
        description: 'Leading private sector bank in India offering comprehensive banking and financial services. Requires advanced E-KYC solutions for digital customer onboarding, compliance management, and regulatory reporting across retail and corporate banking segments.',
        subscribedApplications: ['ekyc', 'sop', 'market-maps', 'iam'],
        userLimit: '5000',
        dataRetention: '7years',
        complianceLevel: 'enhanced',
        customDomain: 'kyc.icicibank.com',
        ssoEnabled: true,
        status: 'active',
        createdAt: '2024-01-10',
        tenantAdminId: '2',
        users: ['2', '3', '4'],
        monthlyRevenue: 1546
      },
      {
        id: 'techcorp',
        name: 'TechCorp Inc',
        type: 'enterprise',
        industry: 'technology',
        country: 'usa',
        contactEmail: 'admin@techcorp.com',
        contactPhone: '+1 555 0123',
        website: 'https://techcorp.com',
        description: 'Leading technology company specializing in AI solutions',
        subscribedApplications: ['ekyc', 'iam', 'api-workflows'],
        userLimit: '1000',
        dataRetention: '5years',
        complianceLevel: 'enhanced',
        customDomain: 'kyc.techcorp.com',
        ssoEnabled: true,
        status: 'active',
        createdAt: '2024-01-15',
        tenantAdminId: '5',
        users: ['5', '6'],
        monthlyRevenue: 1147
      }
    ];

    const mockUserAccess: UserApplicationAccess[] = [
      { userId: '3', applicationIds: ['ekyc', 'sop'], tenantId: 'icici-bank' },
      { userId: '4', applicationIds: ['ekyc'], tenantId: 'icici-bank' },
      { userId: '6', applicationIds: ['ekyc', 'iam'], tenantId: 'techcorp' }
    ];

    setUsers(mockUsers);
    setTenants(mockTenants);
    setUserApplicationAccess(mockUserAccess);

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

  const handleDemoLogin = (userData: User) => {
    // For demo purposes, find the full user data from mock users
    const fullUserData = users.find(u => u.id === userData.id) || userData;
    handleLogin(fullUserData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kyc-pro-user');
  };

  const addTenant = (tenantData: any) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: tenantData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      status: 'active' as const,
      createdAt: new Date().toISOString().split('T')[0],
      users: [],
      monthlyRevenue: tenantData.selectedApplications.reduce((total: number, appId: string) => {
        const app = applications.find(a => a.id === appId);
        return total + (app?.monthlyPrice || 0);
      }, 0)
    };
    setTenants(prev => [...prev, newTenant]);
  };

  const assignTenantAdmin = (tenantId: string, userId: string) => {
    setTenants(prev => prev.map(tenant => 
      tenant.id === tenantId ? { ...tenant, tenantAdminId: userId } : tenant
    ));
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, tenantId, role: 'platform_tenant_admin' as UserRole } : user
    ));
  };

  const assignUserApplications = (userId: string, applicationIds: string[], tenantId: string) => {
    setUserApplicationAccess(prev => {
      const existing = prev.find(access => access.userId === userId);
      if (existing) {
        return prev.map(access => 
          access.userId === userId ? { ...access, applicationIds } : access
        );
      } else {
        return [...prev, { userId, applicationIds, tenantId }];
      }
    });
    
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, assignedApplications: applicationIds } : user
    ));
  };

  const getUserAssignedApplications = (userId: string): string[] => {
    const access = userApplicationAccess.find(a => a.userId === userId);
    return access ? access.applicationIds : [];
  };

  const getTenantForUser = (userId: string): Tenant | undefined => {
    const userObj = users.find(u => u.id === userId);
    if (!userObj?.tenantId) return undefined;
    return tenants.find(t => t.id === userObj.tenantId);
  };

  const getDashboardComponent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'platform_admin':
        return (
          <Hub 
            user={user} 
            onLogout={handleLogout}
            tenants={tenants}
            users={users}
            applications={applications}
            onAddTenant={addTenant}
            onAssignTenantAdmin={assignTenantAdmin}
          />
        );
      case 'platform_tenant_admin':
        const adminTenant = getTenantForUser(user.id);
        const tenantUsers = users.filter(u => u.tenantId === user.tenantId);
        return (
          <Console 
            user={user} 
            onLogout={handleLogout}
            tenant={adminTenant}
            tenantUsers={tenantUsers}
            applications={applications}
            userApplicationAccess={userApplicationAccess}
            onAssignUserApplications={assignUserApplications}
          />
        );
      case 'platform_user':
        const userTenant = getTenantForUser(user.id);
        const assignedApps = getUserAssignedApplications(user.id);
        const availableApplications = applications.filter(app => assignedApps.includes(app.id));
        return (
          <Workspace 
            user={user} 
            onLogout={handleLogout}
            tenant={userTenant}
            assignedApplications={availableApplications}
          />
        );
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
            element={user ? <Navigate to="/dashboard" replace /> : <LandingPage onDemoLogin={handleDemoLogin} />} 
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