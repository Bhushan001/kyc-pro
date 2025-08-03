import React, { useState } from 'react';
import { Building, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { User as UserType } from '../App';
import AuthBackgroundSVG from './AuthBackgroundSVG';

interface SignupTenantAdminPageProps {
  onLogin: (user: UserType) => void;
}

const SignupTenantAdminPage = ({ onLogin }: SignupTenantAdminPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tenantName: '',
    companySize: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Mock signup
    setTimeout(() => {
      const mockUser: UserType = {
        id: Math.random().toString(36).substr(2, 9),
        email: signupForm.email,
        role: 'platform_tenant_admin',
        name: signupForm.name,
        tenantId: 'tenant-' + Math.random().toString(36).substr(2, 6)
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  const seedSignupData = () => {
    setSignupForm({
      name: 'Tenant Administrator',
      email: 'admin@techcorp.com',
      password: 'tenant123',
      confirmPassword: 'tenant123',
      tenantName: 'TechCorp Inc.',
      companySize: '100-500'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <AuthBackgroundSVG />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link to="/auth" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>

          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Building className="h-12 w-12 text-purple-600" />
                <Sparkles className="h-4 w-4 text-yellow-600 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Kyc-Pro</h1>
                <p className="text-sm text-purple-600 font-medium">Enterprise KYC Platform</p>
              </div>
            </div>
            <Badge className="bg-purple-600/10 text-purple-700 border-purple-600/30 mb-4">
              <Building className="h-3 w-3 mr-1" />
              Tenant Administrator
            </Badge>
            <p className="text-muted-foreground text-lg">Set up your organization</p>
          </div>

          {/* Signup Card */}
          <Card className="bg-card/80 backdrop-blur-xl border-border shadow-2xl">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl text-foreground text-center">Tenant Admin Signup</CardTitle>
              <CardDescription className="text-muted-foreground text-center text-base">
                Manage your organization and team members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-12 h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-600/50 focus:ring-purple-600/25 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your work email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-600/50 focus:ring-purple-600/25 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="tenant-name" className="text-foreground font-medium">Organization Name</Label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="tenant-name"
                      type="text"
                      placeholder="Enter your organization name"
                      value={signupForm.tenantName}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, tenantName: e.target.value }))}
                      className="pl-12 h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-600/50 focus:ring-purple-600/25 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-12 pr-12 h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-600/50 focus:ring-purple-600/25 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-purple-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="confirm-password" className="text-foreground font-medium">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-purple-600 transition-colors" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-12 pr-12 h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-purple-600/50 focus:ring-purple-600/25 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-purple-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="rounded border-border bg-input-background mt-1" 
                    required 
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the <a href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</a>
                  </label>
                </div>

                {/* Seed Data Button */}
                <Button 
                  type="button"
                  onClick={seedSignupData}
                  variant="outline" 
                  className="w-full border-yellow-600/50 text-yellow-700 hover:bg-yellow-50 transition-all duration-200"
                >
                  🌱 Fill Demo Data
                </Button>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating organization...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Organization</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Role Benefits */}
          <div className="mt-8 p-4 bg-purple-50 backdrop-blur-sm rounded-lg border border-purple-200">
            <h3 className="text-foreground font-medium mb-2">Tenant Administrator Benefits:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Manage your organization's users</li>
              <li>• Configure KYC workflows</li>
              <li>• Access compliance reporting</li>
              <li>• Monitor verification activities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupTenantAdminPage;