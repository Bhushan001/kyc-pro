import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User as UserType } from '../App';
import AuthBackgroundSVG from './AuthBackgroundSVG';

interface AuthPageProps {
  onLogin: (user: UserType) => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      const mockUser: UserType = {
        id: '1',
        email: loginForm.email,
        role: 'platform_admin', // Mock role for demo
        name: 'John Doe',
        tenantId: 'tenant-1'
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  const seedLoginData = () => {
    setLoginForm({
      email: 'admin@kycpro.com',
      password: 'password123'
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Beautiful SVG Background */}
      <AuthBackgroundSVG />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Shield className="h-12 w-12 text-blue-600" />
                <Sparkles className="h-4 w-4 text-yellow-600 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Kyc-Pro</h1>
                <p className="text-sm text-blue-600 font-medium">Enterprise KYC Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground text-lg">Welcome back to your dashboard</p>
          </div>

          {/* Login Card */}
          <Card className="bg-card/80 backdrop-blur-xl border-border shadow-2xl">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl text-foreground text-center">Sign In</CardTitle>
              <CardDescription className="text-muted-foreground text-center text-base">
                Access your personalized dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-blue-600/50 focus:ring-blue-600/25 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-12 pr-12 h-12 bg-input-background border-border text-foreground placeholder:text-muted-foreground focus:border-blue-600/50 focus:ring-blue-600/25 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <input type="checkbox" className="rounded border-border bg-input-background" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Forgot password?
                  </button>
                </div>
                
                {/* Seed Data Button */}
                <Button 
                  type="button"
                  onClick={seedLoginData}
                  variant="outline" 
                  className="w-full border-yellow-600/50 text-yellow-700 hover:bg-yellow-50 transition-all duration-200"
                >
                  🌱 Fill Demo Data
                </Button>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Demo credentials: any email and password
              </div>
            </CardContent>
          </Card>

          {/* Signup Links */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Don't have an account? Choose your role:</p>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/signup/platform-admin">
                <Button variant="outline" className="w-full border-blue-600/50 text-blue-600 hover:bg-blue-50 transition-all duration-200">
                  <Shield className="mr-2 h-4 w-4" />
                  Sign up as Platform Admin
                </Button>
              </Link>
              <Link to="/signup/tenant-admin">
                <Button variant="outline" className="w-full border-purple-600/50 text-purple-600 hover:bg-purple-50 transition-all duration-200">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up as Tenant Admin
                </Button>
              </Link>
              <Link to="/signup/user">
                <Button variant="outline" className="w-full border-green-600/50 text-green-600 hover:bg-green-50 transition-all duration-200">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up as Platform User
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              Trusted by 500+ organizations worldwide for secure identity verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;