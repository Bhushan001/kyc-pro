import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Zap, BarChart3, CheckCircle, ArrowRight, Star, Building, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-foreground">Kyc-Pro</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <Link to="/auth">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Enterprise-Grade
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                KYC Platform
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Streamline identity verification with our multi-tenant SaaS platform. 
              Built for compliance, scalability, and seamless user experience.
            </p>
            
            {/* Role-based Signup Buttons */}
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center mb-6">
              <Link to="/signup/platform-admin">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 w-64">
                  <Shield className="mr-2 h-5 w-5" />
                  Join as Platform Admin
                </Button>
              </Link>
              <Link to="/signup/tenant-admin">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 w-64">
                  <Building className="mr-2 h-5 w-5" />
                  Join as Tenant Admin
                </Button>
              </Link>
              <Link to="/signup/user">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-64">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Join as Platform User
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-border text-muted-foreground hover:bg-muted">
                Watch Demo
              </Button>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  Already have an account?
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage KYC processes across multiple tenants
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-blue-500/50 transition-colors shadow-sm">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-foreground">Multi-Tenant Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Secure tenant isolation with role-based access control for platform admins, tenant admins, and users.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/50 transition-colors shadow-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-foreground">Role Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Granular permissions system with dedicated dashboards for each user role and responsibility level.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/50 transition-colors shadow-sm">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle className="text-foreground">Real-time Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Lightning-fast identity verification with automated workflows and instant compliance reporting.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/50 transition-colors shadow-sm">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-foreground">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Comprehensive reporting and analytics with customizable metrics for all stakeholder levels.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/50 transition-colors shadow-sm">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-foreground">Compliance Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Built-in compliance features for global regulations including GDPR, AML, and industry standards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-blue-500/50 transition-colors shadow-sm">
              <CardHeader>
                <Star className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-foreground">API Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Robust REST APIs and webhooks for seamless integration with existing business systems.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your organization's needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-foreground">Starter</CardTitle>
                <div className="text-3xl font-bold text-foreground">$99<span className="text-lg text-muted-foreground">/month</span></div>
                <CardDescription className="text-muted-foreground">Perfect for small teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Up to 1,000 verifications/month
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    3 tenant organizations
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Basic analytics
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Email support
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-500 shadow-lg">
              <CardHeader className="text-center">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">Most Popular</div>
                <CardTitle className="text-foreground">Professional</CardTitle>
                <div className="text-3xl font-bold text-foreground">$299<span className="text-lg text-muted-foreground">/month</span></div>
                <CardDescription className="text-muted-foreground">For growing businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Up to 10,000 verifications/month
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Unlimited tenant organizations
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Advanced analytics
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Priority support
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    API access
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-foreground">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-foreground">Custom</div>
                <CardDescription className="text-muted-foreground">For large organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Unlimited verifications
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Custom integrations
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    Dedicated support
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    SLA guarantees
                  </div>
                  <div className="flex items-center text-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    White-label options
                  </div>
                </div>
                <Button variant="outline" className="w-full border-border text-muted-foreground hover:bg-muted">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-foreground">Kyc-Pro</span>
          </div>
          <p className="text-muted-foreground mb-4">Enterprise-grade KYC solutions for the modern world</p>
          <div className="flex justify-center space-x-6 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;