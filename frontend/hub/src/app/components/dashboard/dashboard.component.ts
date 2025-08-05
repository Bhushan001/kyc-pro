import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantCreationStepperComponent } from '../tenant-creation-stepper/tenant-creation-stepper.component';
import { TenantManagementModalComponent } from '../tenant-management-modal/tenant-management-modal.component';
import { ApiService, Tenant, User } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TenantCreationStepperComponent, TenantManagementModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = 'overview';
  showTenantCreation = false;
  showTenantManagement = false;
  selectedTenant: any = null;

  // Real data from backend
  tenants: Tenant[] = [];
  users: User[] = [];
  stats = {
    totalTenants: 0,
    totalUsers: 0,
    monthlyVerifications: 0,
    systemHealth: 99.9
  };

  // Loading states
  loadingTenants = false;
  loadingUsers = false;
  loadingStats = false;

  // Error states
  errorTenants = false;
  errorUsers = false;
  errorStats = false;

  alerts = [
    { id: '1', type: 'warning', message: 'High verification volume detected for TechCorp Inc', time: '10 minutes ago' },
    { id: '2', type: 'info', message: 'New tenant signup: Digital Ventures', time: '2 hours ago' },
    { id: '3', type: 'error', message: 'API rate limit exceeded for Finance Solutions', time: '1 day ago' },
  ];

  applications = [
    {
      id: 'ekyc',
      name: 'E-KYC',
      description: 'Electronic Know Your Customer verification system',
      icon: 'shield',
      monthlyPrice: 500,
      features: ['Document Verification', 'Face Recognition', 'Liveness Detection']
    },
    {
      id: 'sop',
      name: 'SOP',
      description: 'Standard Operating Procedures management',
      icon: 'settings',
      monthlyPrice: 300,
      features: ['Process Automation', 'Compliance Tracking', 'Audit Trails']
    },
    {
      id: 'market-maps',
      name: 'Market Maps',
      description: 'Market intelligence and mapping platform',
      icon: 'map',
      monthlyPrice: 400,
      features: ['Geographic Analysis', 'Market Trends', 'Competitive Intelligence']
    },
    {
      id: 'iam',
      name: 'IAM',
      description: 'Identity and Access Management system',
      icon: 'users',
      monthlyPrice: 350,
      features: ['User Management', 'Role-based Access', 'SSO Integration']
    },
    {
      id: 'console',
      name: 'Console',
      description: 'Administrative console for platform management',
      icon: 'monitor',
      monthlyPrice: 200,
      features: ['System Monitoring', 'Configuration Management', 'Logs & Analytics']
    },
    {
      id: 'hub',
      name: 'Hub',
      description: 'Central hub for multi-tenant management',
      icon: 'building',
      monthlyPrice: 600,
      features: ['Tenant Management', 'User Administration', 'Platform Analytics']
    }
  ];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkBackendHealth();
    this.loadDashboardData();
  }

  checkBackendHealth() {
    console.log('Checking backend health...');
    this.apiService.checkBackendHealth().subscribe({
      next: (health) => {
        console.log('Backend health check successful:', health);
      },
      error: (error) => {
        console.error('Backend health check failed:', error);
        console.log('This is expected if backend services are not running. Using fallback data.');
      }
    });
  }

  loadDashboardData() {
    this.loadTenants();
    this.loadUsers();
    this.loadStats();
  }

  loadTenants() {
    this.loadingTenants = true;
    this.errorTenants = false;

    this.apiService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
        this.loadingTenants = false;
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        this.loadingTenants = false;
        this.errorTenants = true;
        // Fallback to mock data for development
        this.loadMockTenants();
      }
    });
  }

  loadUsers() {
    this.loadingUsers = true;
    this.errorUsers = false;

    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
        this.updateStats();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadingUsers = false;
        this.errorUsers = true;
        // Fallback to mock data for development
        this.loadMockUsers();
      }
    });
  }

  loadStats() {
    this.loadingStats = true;
    this.errorStats = false;

    // For now, calculate stats from loaded data
    // In the future, this could be a dedicated endpoint
    this.updateStats();
    this.loadingStats = false;
  }

  updateStats() {
    this.stats.totalTenants = this.tenants.length;
    this.stats.totalUsers = this.users.length;
    // Mock verification count for now
    this.stats.monthlyVerifications = this.tenants.length * 1000;
  }

  // Helper methods for template
  getTenantUserCount(tenantId: string): number {
    return this.users.filter(u => u.tenantId === tenantId).length;
  }

  getTenantSubscribedApplications(tenantId: string): string[] {
    // Mock applications for now - in real implementation this would come from backend
    const tenant = this.tenants.find(t => t.id === tenantId);
    if (tenant?.plan === 'Enterprise') {
      return ['E-KYC', 'SOP', 'IAM', 'Market Maps'];
    } else if (tenant?.plan === 'Professional') {
      return ['E-KYC', 'SOP'];
    } else {
      return ['E-KYC'];
    }
  }

  // Fallback mock data for development
  private loadMockTenants() {
    this.tenants = [
      {
        id: '1',
        name: 'TechCorp Inc',
        domain: 'techcorp.com',
        status: 'active',
        plan: 'Professional',
        settings: {},
        branding: {}
      },
      {
        id: '2',
        name: 'Finance Solutions',
        domain: 'financesolutions.com',
        status: 'active',
        plan: 'Enterprise',
        settings: {},
        branding: {}
      },
      {
        id: '3',
        name: 'Healthcare Plus',
        domain: 'healthcareplus.com',
        status: 'active',
        plan: 'Standard',
        settings: {},
        branding: {}
      }
    ];
  }

  private loadMockUsers() {
    this.users = [
      {
        id: '1',
        email: 'john.smith@techcorp.com',
        name: 'John Smith',
        role: 'platform_tenant_admin',
        tenantId: '1',
        status: 'active'
      },
      {
        id: '2',
        email: 'sarah.johnson@financepro.com',
        name: 'Sarah Johnson',
        role: 'platform_tenant_admin',
        tenantId: '2',
        status: 'active'
      },
      {
        id: '3',
        email: 'mike.davis@healthcareplus.com',
        name: 'Mike Davis',
        role: 'platform_tenant_admin',
        tenantId: '3',
        status: 'active'
      }
    ];
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    this.authService.logout();
  }

  handleAddTenant() {
    this.showTenantCreation = true;
  }

  handleCloseTenantCreation() {
    this.showTenantCreation = false;
  }

  handleTenantCreationComplete(tenantData: any) {
    console.log('New tenant created:', tenantData);
    
    // Create tenant via API
    const createTenantRequest = {
      name: tenantData.name,
      domain: tenantData.domain || `${tenantData.name.toLowerCase().replace(/\s+/g, '')}.com`,
      plan: tenantData.type,
      settings: {},
      branding: {}
    };

    this.apiService.createTenant(createTenantRequest).subscribe({
      next: (newTenant) => {
        this.tenants.unshift(newTenant);
        this.updateStats();
        alert(`Tenant "${tenantData.name}" has been created successfully!`);
        this.showTenantCreation = false;
      },
      error: (error) => {
        console.error('Error creating tenant:', error);
        alert('Failed to create tenant. Please try again.');
      }
    });
  }

  handleManageTenant(tenant: any) {
    console.log('Manage tenant clicked:', tenant);
    this.selectedTenant = tenant;
    this.showTenantManagement = true;
  }

  handleCloseTenantManagement() {
    this.showTenantManagement = false;
    this.selectedTenant = null;
  }

  handleAssignTenantAdmin(data: {tenantId: string, userId: string}) {
    // Update tenant with new admin
    const tenant = this.tenants.find(t => t.id === data.tenantId);
    const user = this.users.find(u => u.id === data.userId);
    
    if (tenant && user) {
      // Update tenant via API
      const updateData = {
        ...tenant,
        settings: {
          ...tenant.settings,
          adminUserId: data.userId
        }
      };

      this.apiService.updateTenant(tenant.id, updateData).subscribe({
        next: (updatedTenant) => {
          const index = this.tenants.findIndex(t => t.id === tenant.id);
          if (index !== -1) {
            this.tenants[index] = updatedTenant;
          }
          console.log(`Tenant admin assigned: ${user.name} to ${tenant.name}`);
        },
        error: (error) => {
          console.error('Error assigning tenant admin:', error);
        }
      });
    }
  }

  getTotalRevenue(): number {
    return this.tenants.reduce((total, tenant) => {
      const planPrices: { [key: string]: number } = {
        'Standard': 299,
        'Professional': 499,
        'Enterprise': 999
      };
      return total + (planPrices[tenant.plan] || 0);
    }, 0);
  }

  getTopTenants(): any[] {
    return this.tenants.slice(0, 3).map(tenant => ({
      ...tenant,
      users: this.getTenantUserCount(tenant.id),
      lastActive: '2 hours ago', // Mock data
      monthlyRevenue: this.getPlanPrice(tenant.plan)
    }));
  }

  getPlanPrice(plan: string): number {
    const planPrices: { [key: string]: number } = {
      'Standard': 299,
      'Professional': 499,
      'Enterprise': 999
    };
    return planPrices[plan] || 0;
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'error': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'warning': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getAlertColor(type: string): string {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-blue-600';
    }
  }

  getTenantName(tenantId: string): string {
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : tenantId;
  }

  getTenantAdminName(tenantId: string): string {
    const adminUser = this.users.find(u => u.tenantId === tenantId && u.role === 'platform_tenant_admin');
    return adminUser ? adminUser.name : 'Not assigned';
  }

  getRoleDisplayName(role: string): string {
    return role.replace('platform_', '').replace('_', ' ');
  }

  getUserAssignedApplications(userId: string): string[] {
    // Mock applications for now - in real implementation this would come from backend
    const user = this.users.find(u => u.id === userId);
    if (user?.role === 'platform_tenant_admin') {
      return ['E-KYC', 'SOP'];
    } else if (user?.role === 'platform_admin') {
      return ['E-KYC', 'SOP', 'IAM', 'Market Maps'];
    } else {
      return [];
    }
  }

  refreshData() {
    this.loadDashboardData();
  }
}
