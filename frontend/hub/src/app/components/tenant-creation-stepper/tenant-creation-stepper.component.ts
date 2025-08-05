import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  isHighlighted?: boolean;
  monthlyPrice: number;
  features: string[];
}

interface TenantData {
  // Basic Information
  name: string;
  type: string;
  industry: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  description: string;
  
  // Application Selection
  selectedApplications: string[];
  
  // Configuration
  userLimit: string;
  dataRetention: string;
  complianceLevel: string;
  customDomain: string;
  ssoEnabled: boolean;
  
  // Billing
  billingContact: string;
  billingAddress: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-tenant-creation-stepper',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tenant-creation-stepper.component.html',
  styleUrls: ['./tenant-creation-stepper.component.css']
})
export class TenantCreationStepperComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onComplete = new EventEmitter<any>();

  currentStep = 1;
  isLoading = false;

  tenantForm: FormGroup;

  applications: Application[] = [
    {
      id: 'ekyc',
      name: 'E-KYC',
      description: 'Digital Know Your Customer verification with AI-powered document processing and biometric authentication',
      icon: 'eye',
      isHighlighted: true,
      monthlyPrice: 499,
      features: ['Document OCR', 'Biometric Verification', 'AI Risk Assessment', 'Real-time Validation', 'Compliance Reports']
    },
    {
      id: 'sop',
      name: 'Standard Operating Procedures',
      description: 'Automated workflow management and compliance tracking for banking operations',
      icon: 'file-text',
      monthlyPrice: 299,
      features: ['Workflow Automation', 'Compliance Tracking', 'Audit Trails', 'Process Documentation']
    },
    {
      id: 'market-maps',
      name: 'Market Intelligence',
      description: 'Advanced market analysis and customer segmentation tools with real-time insights',
      icon: 'map-pin',
      monthlyPrice: 399,
      features: ['Market Analysis', 'Customer Segmentation', 'Risk Profiling', 'Trend Analytics']
    },
    {
      id: 'iam',
      name: 'Identity & Access Management',
      description: 'Comprehensive IAM solution with role-based access control and SSO integration',
      icon: 'users',
      monthlyPrice: 199,
      features: ['Role-based Access', 'SSO Integration', 'Multi-factor Auth', 'User Provisioning']
    },
    {
      id: 'api-workflows',
      name: 'API Workflow Engine',
      description: 'Powerful API orchestration and workflow automation for seamless integrations',
      icon: 'workflow',
      monthlyPrice: 349,
      features: ['API Orchestration', 'Workflow Builder', 'Integration Hub', 'Rate Limiting']
    }
  ];

  steps = [
    { number: 1, title: 'Basic Information', icon: 'building' },
    { number: 2, title: 'Application Selection', icon: 'settings' },
    { number: 3, title: 'Configuration', icon: 'shield' },
    { number: 4, title: 'Billing', icon: 'credit-card' }
  ];

  constructor(private fb: FormBuilder) {
    this.tenantForm = this.fb.group({
      // Basic Information
      name: ['', Validators.required],
      type: ['', Validators.required],
      industry: ['', Validators.required],
      country: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: [''],
      website: [''],
      description: [''],
      
      // Application Selection
      selectedApplications: [[]],
      
      // Configuration
      userLimit: ['', Validators.required],
      dataRetention: ['', Validators.required],
      complianceLevel: ['', Validators.required],
      customDomain: [''],
      ssoEnabled: [false],
      
      // Billing
      billingContact: ['', Validators.required],
      billingAddress: ['', Validators.required],
      paymentMethod: ['', Validators.required]
    });
  }

  handleClose() {
    this.onClose.emit();
  }

  handleApplicationToggle(appId: string) {
    const currentApps = this.tenantForm.get('selectedApplications')?.value || [];
    const index = currentApps.indexOf(appId);
    
    if (index > -1) {
      currentApps.splice(index, 1);
    } else {
      currentApps.push(appId);
    }
    
    this.tenantForm.patchValue({ selectedApplications: currentApps });
  }

  handleNext() {
    if (this.isStepComplete(this.currentStep)) {
      this.currentStep++;
    }
  }

  handlePrevious() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  handleComplete() {
    if (this.tenantForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const tenantData = this.tenantForm.value;
        this.onComplete.emit(tenantData);
        this.isLoading = false;
      }, 2000);
    }
  }

  getTotalMonthlyCost(): number {
    const selectedApps = this.tenantForm.get('selectedApplications')?.value || [];
    return selectedApps.reduce((total: number, appId: string) => {
      const app = this.applications.find(a => a.id === appId);
      return total + (app?.monthlyPrice || 0);
    }, 0);
  }

  getApplicationName(appId: string): string {
    const app = this.applications.find(a => a.id === appId);
    return app?.name || appId;
  }

  getApplicationPrice(appId: string): number {
    const app = this.applications.find(a => a.id === appId);
    return app?.monthlyPrice || 0;
  }

  getProgressPercentage(): number {
    let completedSteps = 0;
    for (let i = 1; i <= this.steps.length; i++) {
      if (this.isStepComplete(i)) {
        completedSteps++;
      }
    }
    return Math.round((completedSteps / this.steps.length) * 100);
  }

  isStepAccessible(step: number): boolean {
    // Can navigate to current step or any completed step
    return step <= this.currentStep || this.isStepComplete(step);
  }

  navigateToStep(step: number) {
    if (this.isStepAccessible(step)) {
      this.currentStep = step;
    }
  }

  isStepComplete(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.tenantForm.get('name')?.valid && 
               this.tenantForm.get('type')?.valid && 
               this.tenantForm.get('contactEmail')?.valid);
      case 2:
        const selectedApps = this.tenantForm.get('selectedApplications')?.value || [];
        return selectedApps.length > 0;
      case 3:
        return !!(this.tenantForm.get('userLimit')?.valid && 
               this.tenantForm.get('complianceLevel')?.valid);
      case 4:
        return !!(this.tenantForm.get('billingContact')?.valid && 
               this.tenantForm.get('billingAddress')?.valid && 
               this.tenantForm.get('paymentMethod')?.valid);
      default:
        return false;
    }
  }

  fillSampleData() {
    this.tenantForm.patchValue({
      name: 'TechCorp Solutions',
      type: 'Enterprise',
      industry: 'Technology',
      country: 'United States',
      contactEmail: 'admin@techcorp.com',
      contactPhone: '+1 (555) 123-4567',
      website: 'https://techcorp.com',
      description: 'Leading technology solutions provider specializing in digital transformation and cloud services.',
      selectedApplications: ['ekyc', 'iam'],
      userLimit: '500',
      dataRetention: '7 years',
      complianceLevel: 'SOC 2 Type II',
      customDomain: 'techcorp.kycpro.com',
      ssoEnabled: true,
      billingContact: 'finance@techcorp.com',
      billingAddress: '123 Tech Street, San Francisco, CA 94105',
      paymentMethod: 'Credit Card'
    });
  }

  fillSampleDataStep1() {
    this.tenantForm.patchValue({
      name: 'ICICI Bank',
      type: 'Enterprise',
      industry: 'Finance',
      country: 'India',
      contactEmail: 'admin@icicibank.com',
      contactPhone: '+91 22 2653 1414',
      website: 'https://www.icicibank.com',
      description: 'Leading private sector bank in India offering comprehensive banking and financial services. Requires advanced E-KYC solutions for digital customer onboarding, compliance management, and regulatory reporting across retail and corporate banking segments.'
    });
  }

  fillSampleDataStep2() {
    this.tenantForm.patchValue({
      selectedApplications: ['ekyc', 'sop', 'market-maps', 'iam']
    });
  }

  fillSampleDataStep3() {
    this.tenantForm.patchValue({
      userLimit: '5000',
      dataRetention: '7 years',
      complianceLevel: 'SOC 2 Type II',
      customDomain: 'kyc.icicibank.com',
      ssoEnabled: true
    });
  }

  fillSampleDataStep4() {
    this.tenantForm.patchValue({
      billingContact: 'finance@icicibank.com',
      billingAddress: 'ICICI Bank Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India',
      paymentMethod: 'Bank Transfer'
    });
  }

  fillAllSampleData() {
    this.tenantForm.patchValue({
      // Basic Information
      name: 'ICICI Bank',
      type: 'Enterprise',
      industry: 'Finance',
      country: 'India',
      contactEmail: 'admin@icicibank.com',
      contactPhone: '+91 22 2653 1414',
      website: 'https://www.icicibank.com',
      description: 'Leading private sector bank in India offering comprehensive banking and financial services. Requires advanced E-KYC solutions for digital customer onboarding, compliance management, and regulatory reporting across retail and corporate banking segments.',
      
      // Application Selection
      selectedApplications: ['ekyc', 'sop', 'market-maps', 'iam'],
      
      // Configuration
      userLimit: '5000',
      dataRetention: '7 years',
      complianceLevel: 'SOC 2 Type II',
      customDomain: 'kyc.icicibank.com',
      ssoEnabled: true,
      
      // Billing
      billingContact: 'finance@icicibank.com',
      billingAddress: 'ICICI Bank Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India',
      paymentMethod: 'Bank Transfer'
    });
  }
} 