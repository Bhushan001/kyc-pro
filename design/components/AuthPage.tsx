import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import AuthBackgroundSVG from './AuthBackgroundSVG';
import { User } from '../App';
import { toast } from 'sonner@2.0.3';

interface AuthPageProps {
  onLogin: (userData: User) => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user database - this should match the users in App.tsx
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Find user by email
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // For demo purposes, any password works
        console.log('Logging in user:', user);
        toast.success(`Welcome back, ${user.name}!`);
        onLogin(user);
      } else {
        toast.error('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDemoLogin = (demoUser: User) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Demo login for:', demoUser);
      toast.success(`Logged in as ${demoUser.name}`);
      onLogin(demoUser);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 opacity-30">
        <AuthBackgroundSVG />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back to home link */}
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Welcome to Kyc-Pro</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input-background border-border text-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-input-background border-border text-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Login Section */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Quick Demo Access
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleDemoLogin(mockUsers.find(u => u.role === 'platform_admin')!)}
                    disabled={isLoading}
                  >
                    <Shield className="mr-2 h-4 w-4 text-blue-600" />
                    Platform Admin - Hub Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleDemoLogin(mockUsers.find(u => u.email === 'tenant.admin@icici.com')!)}
                    disabled={isLoading}
                  >
                    <Shield className="mr-2 h-4 w-4 text-purple-600" />
                    Tenant Admin - Console Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleDemoLogin(mockUsers.find(u => u.email === 'user1@icici.com')!)}
                    disabled={isLoading}
                  >
                    <Shield className="mr-2 h-4 w-4 text-green-600" />
                    Platform User - Workspace Dashboard
                  </Button>
                </div>
              </div>

              {/* Test Credentials */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Test Credentials:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><strong>Hub:</strong> admin@kycpro.com</p>
                  <p><strong>Console:</strong> tenant.admin@icici.com</p>
                  <p><strong>Workspace:</strong> user1@icici.com</p>
                  <p className="mt-2 text-green-600">Any password works for demo</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup/platform-admin" className="text-blue-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;