import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { ManageAppsModalComponent } from '../manage-apps-modal/manage-apps-modal.component';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

interface Verification {
  id: string;
  user: string;
  userId: string;
  type: string;
  status: string;
  date: string;
  documents: string[];
  notes: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface VerificationType {
  id: string;
  name: string;
  description: string;
  requiredDocuments: string[];
  estimatedTime: string;
}

interface OrgStats {
  totalUsers: number;
  pendingVerifications: number;
  completedThisMonth: number;
  complianceScore: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, SidebarComponent, StatsCardComponent, ManageAppsModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = 'dashboard';
  selectedVerification: Verification | null = null;
  showVerificationModal = false;
  verificationFilter = 'all';
  searchQuery = '';
  
  // Manage Apps Modal
  showManageAppsModal = false;
  selectedUserForApps: User | null = null;
  
  mockOrgStats: OrgStats = {
    totalUsers: 245,
    pendingVerifications: 12,
    completedThisMonth: 187,
    complianceScore: 94
  };

  mockUsers: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@techcorp.com', role: 'Manager', status: 'verified', lastLogin: '2 hours ago' },
    { id: '2', name: 'Bob Smith', email: 'bob@techcorp.com', role: 'Employee', status: 'pending', lastLogin: '1 day ago' },
    { id: '3', name: 'Carol Davis', email: 'carol@techcorp.com', role: 'Employee', status: 'verified', lastLogin: '3 hours ago' },
    { id: '4', name: 'David Wilson', email: 'david@techcorp.com', role: 'Manager', status: 'verified', lastLogin: '5 minutes ago' },
    { id: '5', name: 'Emma Brown', email: 'emma@techcorp.com', role: 'Employee', status: 'verified', lastLogin: '1 week ago' },
    { id: '6', name: 'Frank Miller', email: 'frank@techcorp.com', role: 'Manager', status: 'suspended', lastLogin: '2 weeks ago' },
  ];

  userFilter = 'all';
  userSearchQuery = '';
  showInviteModal = false;
  selectedUser: User | null = null;

  mockVerifications: Verification[] = [
    { 
      id: '1', 
      user: 'Alice Johnson', 
      userId: '1',
      type: 'Identity Document', 
      status: 'completed', 
      date: '2 hours ago',
      documents: ['passport.pdf', 'selfie.jpg'],
      notes: 'All documents verified successfully',
      priority: 'medium'
    },
    { 
      id: '2', 
      user: 'Bob Smith', 
      userId: '2',
      type: 'Address Verification', 
      status: 'pending', 
      date: '1 day ago',
      documents: ['utility_bill.pdf'],
      notes: 'Waiting for additional proof of address',
      priority: 'high',
      dueDate: '2024-01-15'
    },
    { 
      id: '3', 
      user: 'Carol Davis', 
      userId: '3',
      type: 'Enhanced Due Diligence', 
      status: 'in_review', 
      date: '3 hours ago',
      documents: ['bank_statement.pdf', 'employment_letter.pdf'],
      notes: 'Under review by compliance team',
      priority: 'high',
      assignedTo: 'Admin User'
    },
    { 
      id: '4', 
      user: 'David Wilson', 
      userId: '4',
      type: 'Identity Document', 
      status: 'completed', 
      date: '1 hour ago',
      documents: ['drivers_license.pdf', 'selfie.jpg'],
      notes: 'Verification completed successfully',
      priority: 'low'
    },
  ];

  verificationTypes: VerificationType[] = [
    {
      id: 'identity',
      name: 'Identity Document',
      description: 'Government-issued ID verification',
      requiredDocuments: ['Passport', 'Driver\'s License', 'National ID'],
      estimatedTime: '24-48 hours'
    },
    {
      id: 'address',
      name: 'Address Verification',
      description: 'Proof of residential address',
      requiredDocuments: ['Utility Bill', 'Bank Statement', 'Rental Agreement'],
      estimatedTime: '24-48 hours'
    },
    {
      id: 'enhanced',
      name: 'Enhanced Due Diligence',
      description: 'Comprehensive background check',
      requiredDocuments: ['Employment Letter', 'Bank Statements', 'Source of Funds'],
      estimatedTime: '3-5 business days'
    }
  ];

  // Compliance data
  complianceData = {
    overallScore: 94,
    monthlyTrend: 2.5,
    riskLevel: 'low',
    lastAudit: '2024-01-10',
    nextAudit: '2024-04-10',
    complianceAreas: [
      { name: 'Identity Verification', score: 98, status: 'compliant' },
      { name: 'Address Verification', score: 95, status: 'compliant' },
      { name: 'Enhanced Due Diligence', score: 89, status: 'warning' },
      { name: 'Document Retention', score: 96, status: 'compliant' },
      { name: 'Audit Trail', score: 92, status: 'compliant' }
    ],
    recentAudits: [
      { date: '2024-01-10', type: 'Internal', result: 'Pass', findings: 2 },
      { date: '2023-10-15', type: 'External', result: 'Pass', findings: 1 },
      { date: '2023-07-20', type: 'Regulatory', result: 'Pass', findings: 0 }
    ],
    riskFactors: [
      { factor: 'High-risk jurisdictions', count: 3, risk: 'medium' },
      { factor: 'PEP matches', count: 1, risk: 'high' },
      { factor: 'Sanctions hits', count: 0, risk: 'low' },
      { factor: 'Unusual transactions', count: 5, risk: 'medium' }
    ]
  };

  // Applications data
  applicationsData = {
    subscribed: [
      { id: '1', name: 'Identity Verification', status: 'active', users: 45, lastUsed: '2 hours ago', icon: 'shield' },
      { id: '2', name: 'Document Management', status: 'active', users: 32, lastUsed: '1 hour ago', icon: 'file' },
      { id: '3', name: 'Compliance Reporting', status: 'active', users: 28, lastUsed: '3 hours ago', icon: 'chart' },
      { id: '4', name: 'Risk Assessment', status: 'inactive', users: 0, lastUsed: 'Never', icon: 'alert' }
    ],
    available: [
      { id: '5', name: 'Advanced Analytics', status: 'available', price: '$99/month', description: 'Advanced data analytics and insights' },
      { id: '6', name: 'API Integration', status: 'available', price: '$149/month', description: 'Custom API integrations and webhooks' },
      { id: '7', name: 'Multi-factor Auth', status: 'available', price: '$79/month', description: 'Enhanced security with MFA' }
    ]
  };

  // Subscribed applications for dashboard
  subscribedApplications = [
    { id: 'ekyc', name: 'eKYC Platform', monthlyPrice: 299, isHighlighted: true, description: 'Identity verification and KYC processing' },
    { id: 'sop', name: 'SOP Management', monthlyPrice: 199, isHighlighted: false, description: 'Standard operating procedures' },
    { id: 'market-maps', name: 'Market Maps', monthlyPrice: 149, isHighlighted: false, description: 'Geographic market analysis' },
    { id: 'iam', name: 'IAM System', monthlyPrice: 399, isHighlighted: true, description: 'Identity and access management' }
  ];

  // Available applications for modal (with features)
  availableApplications = [
    { 
      id: 'ekyc', 
      name: 'eKYC Platform', 
      monthlyPrice: 299, 
      isHighlighted: true, 
      description: 'Identity verification and KYC processing',
      features: ['KYC', 'Compliance', 'Security']
    },
    { 
      id: 'sop', 
      name: 'SOP Management', 
      monthlyPrice: 199, 
      isHighlighted: false, 
      description: 'Standard operating procedures',
      features: ['Documentation', 'Workflow', 'Approval']
    },
    { 
      id: 'market-maps', 
      name: 'Market Maps', 
      monthlyPrice: 149, 
      isHighlighted: false, 
      description: 'Geographic market analysis',
      features: ['Analytics', 'Mapping', 'Reports']
    },
    { 
      id: 'iam', 
      name: 'IAM System', 
      monthlyPrice: 399, 
      isHighlighted: true, 
      description: 'Identity and access management',
      features: ['Authentication', 'Authorization', 'SSO']
    }
  ];

  // Mock user application access
  userApplicationAccess: { [userId: string]: string[] } = {
    '1': ['ekyc', 'iam'],
    '2': ['ekyc'],
    '3': ['ekyc', 'sop'],
    '4': ['ekyc', 'iam', 'market-maps'],
    '5': ['ekyc'],
    '6': ['ekyc', 'sop']
  };

  // Settings data
  settingsData = {
    organization: {
      name: 'TechCorp Inc',
      email: 'admin@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, Suite 100, San Francisco, CA 94105',
      industry: 'Technology',
      size: '50-200 employees',
      website: 'https://techcorp.com'
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
      auditLogging: true
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      verificationAlerts: true,
      complianceReports: true,
      securityAlerts: true
    },
    integrations: [
      { name: 'Slack', status: 'connected', lastSync: '2 hours ago' },
      { name: 'Microsoft Teams', status: 'disconnected', lastSync: 'Never' },
      { name: 'Jira', status: 'connected', lastSync: '1 day ago' },
      { name: 'Salesforce', status: 'connected', lastSync: '3 hours ago' }
    ],
    billing: {
      plan: 'Professional',
      nextBilling: '2024-02-15',
      amount: '$299/month',
      users: 45,
      maxUsers: 100
    }
  };

  activeSettingsTab = 'profile';

  // Computed properties for template bindings
  get pendingVerificationsCount(): number {
    return this.mockVerifications.filter(v => v.status === 'pending').length;
  }

  get inReviewVerificationsCount(): number {
    return this.mockVerifications.filter(v => v.status === 'in_review').length;
  }

  get completedVerificationsCount(): number {
    return this.mockVerifications.filter(v => v.status === 'completed').length;
  }

  get rejectedVerificationsCount(): number {
    return this.mockVerifications.filter(v => v.status === 'rejected').length;
  }

  constructor() { }

  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'in_review':
        return 'bg-blue-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  }

  getBadgeVariant(status: string): string {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'in_review':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getFilteredVerifications(): Verification[] {
    let filtered = this.mockVerifications;
    
    if (this.verificationFilter !== 'all') {
      filtered = filtered.filter(v => v.status === this.verificationFilter);
    }
    
    if (this.searchQuery) {
      filtered = filtered.filter(v => 
        v.user.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        v.type.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }

  openVerificationModal(verification: Verification): void {
    this.selectedVerification = verification;
    this.showVerificationModal = true;
  }

  closeVerificationModal(): void {
    this.selectedVerification = null;
    this.showVerificationModal = false;
  }

  updateVerificationStatus(verificationId: string, status: string): void {
    const verification = this.mockVerifications.find(v => v.id === verificationId);
    if (verification) {
      verification.status = status;
      if (status === 'completed') {
        this.mockOrgStats.completedThisMonth++;
        this.mockOrgStats.pendingVerifications--;
      }
    }
  }

  assignVerification(verificationId: string, assignedTo: string): void {
    const verification = this.mockVerifications.find(v => v.id === verificationId);
    if (verification) {
      verification.assignedTo = assignedTo;
    }
  }

  onVerificationStatusChange(event: Event, verificationId: string): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updateVerificationStatus(verificationId, target.value);
    }
  }

  onVerificationAssignmentChange(event: Event, verificationId: string): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.assignVerification(verificationId, target.value);
    }
  }

  onOrganizationSettingChange(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateOrganizationSettings(field, target.value);
    }
  }

  onSecuritySettingChange(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      if (field === 'twoFactorAuth' || field === 'auditLogging') {
        this.updateSecuritySettings(field, target.checked);
      } else {
        this.updateSecuritySettings(field, target.value);
      }
    }
  }

  onNotificationSettingChange(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.updateNotificationSettings(field, target.checked);
    }
  }

  setSettingsTab(tab: string): void {
    this.activeSettingsTab = tab;
  }

  updateOrganizationSettings(field: string, value: any): void {
    if (this.settingsData.organization.hasOwnProperty(field)) {
      (this.settingsData.organization as any)[field] = value;
    }
  }

  updateSecuritySettings(field: string, value: any): void {
    if (this.settingsData.security.hasOwnProperty(field)) {
      (this.settingsData.security as any)[field] = value;
    }
  }

  updateNotificationSettings(field: string, value: boolean): void {
    if (this.settingsData.notifications.hasOwnProperty(field)) {
      (this.settingsData.notifications as any)[field] = value;
    }
  }

  toggleIntegration(integrationName: string): void {
    const integration = this.settingsData.integrations.find(i => i.name === integrationName);
    if (integration) {
      integration.status = integration.status === 'connected' ? 'disconnected' : 'connected';
      integration.lastSync = integration.status === 'connected' ? 'Just now' : 'Never';
    }
  }

  getFilteredUsers(): User[] {
    let filtered = this.mockUsers;
    
    if (this.userFilter !== 'all') {
      filtered = filtered.filter(u => u.status === this.userFilter);
    }
    
    if (this.userSearchQuery) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(this.userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(this.userSearchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(this.userSearchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }

  openInviteModal(): void {
    this.showInviteModal = true;
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
  }

  inviteUser(userData: any): void {
    // Simulate API call
    const newUser: User = {
      id: (this.mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: 'pending',
      lastLogin: 'Never'
    };
    
    this.mockUsers.push(newUser);
    this.mockOrgStats.totalUsers++;
    this.closeInviteModal();
  }

  updateUserStatus(userId: string, status: string): void {
    const user = this.mockUsers.find(u => u.id === userId);
    if (user) {
      user.status = status;
    }
  }

  deleteUser(userId: string): void {
    this.mockUsers = this.mockUsers.filter(u => u.id !== userId);
    this.mockOrgStats.totalUsers--;
  }

  getUserInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  onLogout(): void {
    console.log('Logout clicked');
    // Add logout logic here
  }

  onSearch(query: string): void {
    console.log('Search query:', query);
    // Add search logic here
  }

  manageUserApps(user: User): void {
    this.selectedUserForApps = user;
    this.showManageAppsModal = true;
  }

  closeManageAppsModal(): void {
    this.showManageAppsModal = false;
    this.selectedUserForApps = null;
  }

  updateUserApplicationAccess(data: {userId: string, applicationIds: string[]}): void {
    this.userApplicationAccess[data.userId] = data.applicationIds;
    console.log(`Updated application access for user ${data.userId}:`, data.applicationIds);
  }

  getCurrentUserAccess(userId: string): string[] {
    return this.userApplicationAccess[userId] || [];
  }

  getApplicationName(appId: string): string {
    const app = this.availableApplications.find(a => a.id === appId);
    return app ? app.name : appId;
  }

  getIconPath(icon: string): string {
    const iconPaths: { [key: string]: string } = {
      chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      file: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    };
    return iconPaths[icon] || '';
  }

  getApplicationIcon(appId: string): string {
    const iconPaths: { [key: string]: string } = {
      ekyc: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      sop: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      'market-maps': 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      iam: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      'api-workflows': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
    };
    return iconPaths[appId] || 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
  }
} 