import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, CheckCircle, Users, Building, BarChart3, Eye, FileText, MapPin, UsersIcon, Workflow, Star, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import AuthBackgroundSVG from './AuthBackgroundSVG';

interface LandingPageProps {
  onDemoLogin?: (userData: any) => void;
}

const LandingPage = ({ onDemoLogin }: LandingPageProps) => {
  const handleDemoLogin = (role: string, userData: any) => {
    if (onDemoLogin) {
      onDemoLogin(userData);
    }
  };

  const demoUsers = [
    {
      id: '1',
      email: 'admin@kycpro.com',
      role: 'platform_admin',
      name: 'Platform Admin',
      description: 'Full platform access - manage all tenants and users'
    },
    {
      id: '2',
      email: 'tenant.admin@icici.com',
      role: 'platform_tenant_admin',
      name: 'Rajesh Kumar',
      tenantId: 'icici-bank',
      description: 'ICICI Bank tenant admin - manage team and applications'
    },
    {
      id: '3',
      email: 'user1@icici.com',
      role: 'platform_user',
      name: 'Priya Sharma',
      tenantId: 'icici-bank',
      assignedApplications: ['ekyc', 'sop'],
      description: 'ICICI Bank user - access to E-KYC and SOP applications'
    }
  ];

  const applications = [
    {
      id: 'ekyc',
      name: 'E-KYC',
      description: 'Digital Know Your Customer verification',
      monthlyPrice: 499,
      features: ['Document OCR', 'Biometric Verification', 'AI Risk Assessment', 'Real-time Validation'],
      isHighlighted: true
    },
    {
      id: 'sop',
      name: 'Standard Operating Procedures',
      description: 'Automated workflow management',
      monthlyPrice: 299,
      features: ['Workflow Automation', 'Compliance Tracking', 'Audit Trails']
    },
    {
      id: 'market-maps',
      name: 'Market Intelligence',
      description: 'Advanced market analysis tools',
      monthlyPrice: 399,
      features: ['Market Analysis', 'Customer Segmentation', 'Risk Profiling']
    },
    {
      id: 'iam',
      name: 'Identity & Access Management',
      description: 'Comprehensive IAM solution',
      monthlyPrice: 199,
      features: ['Role-based Access', 'SSO Integration', 'Multi-factor Auth']
    },
    {
      id: 'api-workflows',
      name: 'API Workflow Engine',
      description: 'Powerful API orchestration',
      monthlyPrice: 349,
      features: ['API Orchestration', 'Workflow Builder', 'Integration Hub']
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: 99,
      description: 'Perfect for small businesses and startups',
      features: [
        'Up to 100 users',
        'Basic E-KYC verification',
        'Standard support',
        'Basic compliance reporting',
        'Email integration',
        'Mobile app access'
      ],
      limitations: [
        'No biometric verification',
        'Limited API calls (1,000/month)',
        'Basic analytics only'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: 299,
      description: 'Ideal for growing companies and financial institutions',
      features: [
        'Up to 1,000 users',
        'Full E-KYC suite with biometrics',
        'Priority support',
        'Advanced compliance reporting',
        'API access (10,000 calls/month)',
        'Custom integrations',
        'Advanced analytics dashboard',
        'Multi-tenant architecture',
        'SSO integration'
      ],
      limitations: [
        'No white-label options',
        'Standard SLA (99.5% uptime)'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 999,
      description: 'For large enterprises and banks requiring maximum security',
      features: [
        'Unlimited users',
        'Complete KYC platform access',
        'Dedicated support manager',
        'Custom compliance frameworks',
        'Unlimited API calls',
        'White-label solutions',
        'Advanced security features',
        'Custom development',
        'Premium SLA (99.9% uptime)',
        'Dedicated infrastructure',
        'Custom reporting',
        'Regulatory consultation'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background SVG */}
      <div className="absolute inset-0 opacity-30">
        <AuthBackgroundSVG />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-foreground">Kyc-Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup/platform-admin">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              Multi-Tenant KYC Platform
            </Badge>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Enterprise KYC Solutions for Modern Organizations
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comprehensive Know Your Customer platform with role-based access, multi-tenant architecture, 
              and AI-powered verification workflows for banks, fintechs, and enterprises.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/signup/platform-admin">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Access Section */}
        <section className="px-6 py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Experience Different User Roles
              </h2>
              <p className="text-lg text-muted-foreground">
                Try the platform from different perspectives - Platform Admin, Tenant Admin, or End User
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {demoUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {user.role === 'platform_admin' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                        {user.role === 'platform_tenant_admin' && <Building className="h-5 w-5 text-purple-600" />}
                        {user.role === 'platform_user' && <Users className="h-5 w-5 text-green-600" />}
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {user.role.replace('platform_', '').replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>{user.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Email:</strong> {user.email}</p>
                        {user.tenantId && <p><strong>Organization:</strong> {user.tenantId === 'icici-bank' ? 'ICICI Bank' : user.tenantId}</p>}
                      </div>
                      
                      {user.assignedApplications && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Assigned Applications:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.assignedApplications.map((app) => (
                              <Badge key={app} variant="secondary" className="text-xs">
                                {app === 'ekyc' ? 'E-KYC' : 
                                 app === 'sop' ? 'SOP' : 
                                 app === 'iam' ? 'IAM' : app}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full mt-4"
                        variant={user.role === 'platform_user' ? 'default' : 'outline'}
                        onClick={() => handleDemoLogin(user.role, user)}
                      >
                        {user.role === 'platform_admin' ? 'View Hub Dashboard' :
                         user.role === 'platform_tenant_admin' ? 'View Console Dashboard' :
                         'View Workspace Dashboard'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Comprehensive KYC Platform Features
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything your organization needs for secure, compliant customer verification
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Eye className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>E-KYC Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI-powered document processing, biometric verification, and real-time identity validation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Standard Operating Procedures</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automated workflow management and compliance tracking for banking operations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MapPin className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Market Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Advanced market analysis and customer segmentation with real-time insights.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <UsersIcon className="h-8 w-8 text-orange-600 mb-2" />
                  <CardTitle>Identity & Access Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Role-based access control, SSO integration, and comprehensive user management.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Workflow className="h-8 w-8 text-red-600 mb-2" />
                  <CardTitle>API Workflow Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Powerful API orchestration and workflow automation for seamless integrations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Multi-Tenant Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enterprise-grade security with tenant isolation and compliance reporting.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect plan for your organization. All plans include our core security features and 24/7 support.
              </p>
            </div>

            {/* Pricing Tiers */}
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {pricingTiers.map((tier, index) => (
                <Card key={tier.name} className={`relative ${tier.popular ? 'border-2 border-blue-500 shadow-lg scale-105' : 'border-border'}`}>
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription className="mt-4">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Included Features:</h4>
                      <ul className="space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {tier.limitations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Limitations:</h4>
                        <ul className="space-y-2">
                          {tier.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <X className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4">
                      <Link to={tier.name === 'Enterprise' ? '/contact' : '/signup/platform-admin'}>
                        <Button 
                          className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                          variant={tier.popular ? 'default' : 'outline'}
                        >
                          {tier.cta}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Individual Application Pricing */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Individual Application Pricing
                </h3>
                <p className="text-lg text-muted-foreground">
                  Build your custom package by selecting individual applications
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                  <Card key={app.id} className={`hover:shadow-lg transition-shadow ${app.isHighlighted ? 'border-2 border-yellow-400' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {app.id === 'ekyc' && <Eye className="h-6 w-6 text-blue-600" />}
                          {app.id === 'sop' && <FileText className="h-6 w-6 text-green-600" />}
                          {app.id === 'market-maps' && <MapPin className="h-6 w-6 text-purple-600" />}
                          {app.id === 'iam' && <UsersIcon className="h-6 w-6 text-orange-600" />}
                          {app.id === 'api-workflows' && <Workflow className="h-6 w-6 text-red-600" />}
                          <CardTitle className="text-lg">{app.name}</CardTitle>
                        </div>
                        {app.isHighlighted && (
                          <Badge variant="outline" className="border-yellow-400 text-yellow-600 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{app.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-foreground">${app.monthlyPrice}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        
                        <ul className="space-y-2">
                          {app.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button 
                          className={`w-full ${app.isHighlighted ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                          variant={app.isHighlighted ? 'default' : 'outline'}
                        >
                          Add to Package
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Need a custom combination? Our team can help you build the perfect package.
                </p>
                <Button variant="outline" size="lg">
                  Contact Sales for Custom Pricing
                </Button>
              </div>
            </div>

            {/* Pricing FAQ */}
            <div className="mt-16 bg-white/70 rounded-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Do you offer a free trial?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! All plans come with a 14-day free trial. No credit card required to start.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">Can I upgrade or downgrade anytime?</h4>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. You can change your plan at any time, and we'll prorate the charges accordingly.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">What payment methods do you accept?</h4>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, wire transfers, and can invoice enterprise customers.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">Is there a setup fee?</h4>
                  <p className="text-sm text-muted-foreground">
                    No setup fees for Starter and Professional plans. Enterprise plans may include onboarding services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your KYC Process?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join leading organizations using Kyc-Pro for secure, compliant customer verification.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/signup/platform-admin">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                  <span className="text-xl font-bold">Kyc-Pro</span>
                </div>
                <p className="text-gray-400">
                  Enterprise KYC solutions for modern organizations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>E-KYC Platform</li>
                  <li>API Documentation</li>
                  <li>Integrations</li>
                  <li>Security</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Contact</li>
                  <li>Blog</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Help Center</li>
                  <li>Community</li>
                  <li>Status</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Kyc-Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;