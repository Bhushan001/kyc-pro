import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthBackgroundSvgComponent } from '../auth-background-svg/auth-background-svg.component';
import { DemoUserCardComponent } from '../demo-user-card/demo-user-card.component';
import { ApplicationCardComponent } from '../application-card/application-card.component';
import { PricingTierComponent } from '../pricing-tier/pricing-tier.component';
import { DemoUser, Application, PricingTier } from '../../shared/interfaces/landing.interface';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuthBackgroundSvgComponent,
    DemoUserCardComponent,
    ApplicationCardComponent,
    PricingTierComponent
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  demoUsers: DemoUser[] = [
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

  applications: Application[] = [
    {
      id: 'ekyc',
      name: 'E-KYC',
      description: 'Digital Know Your Customer verification',
      monthlyPrice: 499,
      features: ['Document OCR', 'Biometric Verification', 'AI Risk Assessment', 'Real-time Validation'],
      icon: 'eye',
      color: 'blue',
      isHighlighted: true
    },
    {
      id: 'sop',
      name: 'Standard Operating Procedures',
      description: 'Automated workflow management',
      monthlyPrice: 299,
      features: ['Workflow Automation', 'Compliance Tracking', 'Audit Trails'],
      icon: 'file-text',
      color: 'green'
    },
    {
      id: 'market-maps',
      name: 'Market Intelligence',
      description: 'Advanced market analysis tools',
      monthlyPrice: 399,
      features: ['Market Analysis', 'Customer Segmentation', 'Risk Profiling'],
      icon: 'map-pin',
      color: 'purple'
    },
    {
      id: 'iam',
      name: 'Identity & Access Management',
      description: 'Comprehensive IAM solution',
      monthlyPrice: 199,
      features: ['Role-based Access', 'SSO Integration', 'Multi-factor Auth'],
      icon: 'users',
      color: 'orange'
    },
    {
      id: 'api-workflows',
      name: 'API Workflow Engine',
      description: 'Powerful API orchestration',
      monthlyPrice: 349,
      features: ['API Orchestration', 'Workflow Builder', 'Integration Hub'],
      icon: 'workflow',
      color: 'red'
    }
  ];

  pricingTiers: PricingTier[] = [
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

  handleDemoLogin(user: DemoUser) {
    // Navigate to the appropriate portal based on user role
    switch (user.role) {
      case 'platform_admin':
        // Navigate to hub portal (Console - Platform Admin)
        window.open('http://localhost:4201/dashboard', '_blank');
        break;
      case 'platform_tenant_admin':
        // Navigate to console portal (Console - Tenant Admin)
        window.open('http://localhost:4201/dashboard', '_blank');
        break;
      case 'platform_user':
        // Navigate to workspace portal (Workspace - Platform User)
        window.open('http://localhost:4203/dashboard', '_blank');
        break;
      default:
        console.log('Unknown role:', user.role);
    }
  }
} 