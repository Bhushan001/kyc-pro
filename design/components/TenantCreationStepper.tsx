import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Building, Settings, CreditCard, Eye, Shield, FileText, Users, Workflow, MapPin, Star, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface TenantCreationStepperProps {
  onClose: () => void;
  onComplete: (tenantData: any) => void;
}

interface Application {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isHighlighted?: boolean;
  monthlyPrice: number;
  features: string[];
}

const TenantCreationStepper = ({ onClose, onComplete }: TenantCreationStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [tenantData, setTenantData] = useState({
    // Basic Information
    name: '',
    type: '',
    industry: '',
    country: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    description: '',
    
    // Application Selection
    selectedApplications: [] as string[],
    
    // Configuration
    userLimit: '',
    dataRetention: '',
    complianceLevel: '',
    customDomain: '',
    ssoEnabled: false,
    
    // Billing
    billingContact: '',
    billingAddress: '',
    paymentMethod: ''
  });

  const applications: Application[] = [
    {
      id: 'ekyc',
      name: 'E-KYC',
      description: 'Digital Know Your Customer verification with AI-powered document processing and biometric authentication',
      icon: <Eye className="h-6 w-6" />,
      isHighlighted: true,
      monthlyPrice: 499,
      features: ['Document OCR', 'Biometric Verification', 'AI Risk Assessment', 'Real-time Validation', 'Compliance Reports']
    },
    {
      id: 'sop',
      name: 'Standard Operating Procedures',
      description: 'Automated workflow management and compliance tracking for banking operations',
      icon: <FileText className="h-6 w-6" />,
      monthlyPrice: 299,
      features: ['Workflow Automation', 'Compliance Tracking', 'Audit Trails', 'Process Documentation']
    },
    {
      id: 'market-maps',
      name: 'Market Intelligence',
      description: 'Advanced market analysis and customer segmentation tools with real-time insights',
      icon: <MapPin className="h-6 w-6" />,
      monthlyPrice: 399,
      features: ['Market Analysis', 'Customer Segmentation', 'Risk Profiling', 'Trend Analytics']
    },
    {
      id: 'iam',
      name: 'Identity & Access Management',
      description: 'Comprehensive IAM solution with role-based access control and SSO integration',
      icon: <Users className="h-6 w-6" />,
      monthlyPrice: 199,
      features: ['Role-based Access', 'SSO Integration', 'Multi-factor Auth', 'User Provisioning']
    },
    {
      id: 'api-workflows',
      name: 'API Workflow Engine',
      description: 'Powerful API orchestration and workflow automation for seamless integrations',
      icon: <Workflow className="h-6 w-6" />,
      monthlyPrice: 349,
      features: ['API Orchestration', 'Workflow Builder', 'Integration Hub', 'Rate Limiting']
    }
  ];

  const steps = [
    { number: 1, title: 'Basic Information', icon: Building },
    { number: 2, title: 'Application Selection', icon: Settings },
    { number: 3, title: 'Configuration', icon: Shield },
    { number: 4, title: 'Review & Confirm', icon: Check }
  ];

  const fillSampleDataStep1 = () => {
    setTenantData(prev => ({
      ...prev,
      name: 'ICICI Bank',
      type: 'bank',
      industry: 'banking',
      country: 'india',
      contactEmail: 'admin@icicibank.com',
      contactPhone: '+91 22 2653 1414',
      website: 'https://www.icicibank.com',
      description: 'Leading private sector bank in India offering comprehensive banking and financial services. Requires advanced E-KYC solutions for digital customer onboarding, compliance management, and regulatory reporting across retail and corporate banking segments.'
    }));
  };

  const fillSampleDataStep2 = () => {
    setTenantData(prev => ({
      ...prev,
      selectedApplications: ['ekyc', 'sop', 'market-maps', 'iam']
    }));
  };

  const fillSampleDataStep3 = () => {
    setTenantData(prev => ({
      ...prev,
      userLimit: '5000',
      dataRetention: '7years',
      complianceLevel: 'enhanced',
      customDomain: 'kyc.icicibank.com',
      ssoEnabled: true
    }));
  };

  const fillAllSampleData = () => {
    setTenantData({
      // Basic Information
      name: 'ICICI Bank',
      type: 'bank',
      industry: 'banking',
      country: 'india',
      contactEmail: 'admin@icicibank.com',
      contactPhone: '+91 22 2653 1414',
      website: 'https://www.icicibank.com',
      description: 'Leading private sector bank in India offering comprehensive banking and financial services. Requires advanced E-KYC solutions for digital customer onboarding, compliance management, and regulatory reporting across retail and corporate banking segments.',
      
      // Application Selection
      selectedApplications: ['ekyc', 'sop', 'market-maps', 'iam'],
      
      // Configuration
      userLimit: '5000',
      dataRetention: '7years',
      complianceLevel: 'enhanced',
      customDomain: 'kyc.icicibank.com',
      ssoEnabled: true,
      
      // Billing
      billingContact: '',
      billingAddress: '',
      paymentMethod: ''
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setTenantData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplicationToggle = (appId: string) => {
    setTenantData(prev => ({
      ...prev,
      selectedApplications: prev.selectedApplications.includes(appId)
        ? prev.selectedApplications.filter(id => id !== appId)
        : [...prev.selectedApplications, appId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onComplete(tenantData);
      setIsLoading(false);
    }, 2000);
  };

  const getTotalMonthlyCost = () => {
    return tenantData.selectedApplications.reduce((total, appId) => {
      const app = applications.find(a => a.id === appId);
      return total + (app?.monthlyPrice || 0);
    }, 0);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return tenantData.name && tenantData.type && tenantData.contactEmail;
      case 2:
        return tenantData.selectedApplications.length > 0;
      case 3:
        return tenantData.userLimit && tenantData.complianceLevel;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Tenant</h1>
            <p className="text-muted-foreground">Configure a new organization on the platform</p>
          </div>
        </div>
        
        {/* Fill All Sample Data Button */}
        <Button 
          variant="outline" 
          onClick={fillAllSampleData}
          className="border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          Fill All Sample Data
        </Button>
      </div>

      {/* Stepper Navigation */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center space-x-2">
                <div className={`flex items-center space-x-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep === step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : isStepComplete(step.number) || currentStep > step.number
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-border text-muted-foreground'
                  }`}>
                    {isStepComplete(step.number) && currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-sm">
                    <p className={`font-medium ${currentStep === step.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">Step {step.number}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-4 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Basic Information</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Enter the basic details for the new tenant organization
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fillSampleDataStep1}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Fill Sample Data
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Organization Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., ICICI Bank"
                      value={tenantData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Organization Type *</Label>
                    <Select value={tenantData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={tenantData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banking">Banking & Finance</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={tenantData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="india">India</SelectItem>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="singapore">Singapore</SelectItem>
                        <SelectItem value="uae">United Arab Emirates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Primary Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="admin@icicibank.com"
                      value={tenantData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      placeholder="+91 22 2653 1414"
                      value={tenantData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://www.icicibank.com"
                      value={tenantData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the organization and its KYC requirements..."
                      value={tenantData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Application Selection</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose the applications and services this tenant will have access to
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fillSampleDataStep2}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Fill Sample Data
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                    tenantData.selectedApplications.includes(app.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border hover:border-muted-foreground'
                  } ${app.isHighlighted ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
                  onClick={() => handleApplicationToggle(app.id)}>
                    {app.isHighlighted && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-yellow-500 text-yellow-900">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={tenantData.selectedApplications.includes(app.id)}
                        onChange={() => handleApplicationToggle(app.id)}
                      />
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        app.isHighlighted ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {app.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground">{app.name}</h3>
                          <div className="text-right">
                            <p className="font-medium text-foreground">${app.monthlyPrice}/month</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {app.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Configuration Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure tenant-specific settings and limitations
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fillSampleDataStep3}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Fill Sample Data
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userLimit">User Limit *</Label>
                    <Select value={tenantData.userLimit} onValueChange={(value) => handleInputChange('userLimit', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">Up to 100 users</SelectItem>
                        <SelectItem value="500">Up to 500 users</SelectItem>
                        <SelectItem value="1000">Up to 1,000 users</SelectItem>
                        <SelectItem value="5000">Up to 5,000 users</SelectItem>
                        <SelectItem value="unlimited">Unlimited users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataRetention">Data Retention</Label>
                    <Select value={tenantData.dataRetention} onValueChange={(value) => handleInputChange('dataRetention', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                        <SelectItem value="5years">5 Years</SelectItem>
                        <SelectItem value="7years">7 Years</SelectItem>
                        <SelectItem value="10years">10 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complianceLevel">Compliance Level *</Label>
                    <RadioGroup value={tenantData.complianceLevel} onValueChange={(value) => handleInputChange('complianceLevel', value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enhanced" id="enhanced" />
                        <Label htmlFor="enhanced">Enhanced (Banking Grade)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="premium" id="premium" />
                        <Label htmlFor="premium">Premium (Government Grade)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customDomain">Custom Domain</Label>
                    <Input
                      id="customDomain"
                      placeholder="kyc.icicibank.com"
                      value={tenantData.customDomain}
                      onChange={(e) => handleInputChange('customDomain', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <Checkbox
                      id="sso"
                      checked={tenantData.ssoEnabled}
                      onCheckedChange={(checked) => handleInputChange('ssoEnabled', checked)}
                    />
                    <Label htmlFor="sso">Enable Single Sign-On (SSO) Integration</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Review & Confirm</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Please review all information before creating the tenant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {tenantData.name}</p>
                      <p><span className="text-muted-foreground">Type:</span> {tenantData.type}</p>
                      <p><span className="text-muted-foreground">Industry:</span> {tenantData.industry}</p>
                      <p><span className="text-muted-foreground">Contact:</span> {tenantData.contactEmail}</p>
                      {tenantData.website && <p><span className="text-muted-foreground">Website:</span> {tenantData.website}</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">User Limit:</span> {tenantData.userLimit}</p>
                      <p><span className="text-muted-foreground">Compliance Level:</span> {tenantData.complianceLevel}</p>
                      <p><span className="text-muted-foreground">Data Retention:</span> {tenantData.dataRetention}</p>
                      <p><span className="text-muted-foreground">SSO Enabled:</span> {tenantData.ssoEnabled ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Selected Applications</h4>
                  <div className="space-y-2">
                    {tenantData.selectedApplications.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      return app ? (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                              {app.icon}
                            </div>
                            <span className="font-medium text-foreground">{app.name}</span>
                          </div>
                          <span className="text-foreground">${app.monthlyPrice}/month</span>
                        </div>
                      ) : null;
                    })}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="font-medium text-foreground">Total Monthly Cost:</span>
                      <span className="font-bold text-blue-600">${getTotalMonthlyCost()}/month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Step {currentStep} of 4</span>
                  <span className="text-foreground">{Math.round((currentStep / 4) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {tenantData.selectedApplications.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tenantData.selectedApplications.map(appId => {
                    const app = applications.find(a => a.id === appId);
                    return app ? (
                      <div key={app.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{app.name}</span>
                        <span className="text-foreground">${app.monthlyPrice}</span>
                      </div>
                    ) : null;
                  })}
                  <hr className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Total/month</span>
                    <span className="text-blue-600">${getTotalMonthlyCost()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample Data Information */}
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-900 text-sm">Development Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-purple-700">
                  Use the "Fill Sample Data" buttons to quickly populate forms with realistic test data for ICICI Bank.
                </p>
                <div className="flex items-center space-x-1">
                  <Wand2 className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-purple-600">Sample data available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="border-border"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepComplete(currentStep)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Tenant...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Tenant
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantCreationStepper;