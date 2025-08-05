import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DebugInfoComponent } from '../debug-info/debug-info.component';
import { EKYCApplicationComponent } from '../ekyc-application/ekyc-application.component';
import { DocumentUploadModalComponent } from '../document-upload-modal/document-upload-modal.component';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

interface Tenant {
  id: string;
  name: string;
  type: string;
}

interface Application {
  id: string;
  name: string;
  description: string;
  isHighlighted: boolean;
  features: string[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadDate: string | null;
  expiryDate: string | null;
}

interface Task {
  id: string;
  title: string;
  priority: string;
  dueDate: string;
  completed: boolean;
}

interface EKYCActivity {
  id: string;
  type: string;
  customer: string;
  status: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DebugInfoComponent, EKYCApplicationComponent, DocumentUploadModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = 'overview';
  selectedApp: string | null = null;
  showEKYCApp = false;
  showDocumentUploadModal = false;

  // Mock user data
  user: User = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@techcorp.com',
    role: 'platform_user',
    organization: 'TechCorp Inc'
  };

  tenant: Tenant = {
    id: '1',
    name: 'TechCorp Inc',
    type: 'Enterprise'
  };

  // Assigned applications
  assignedApplications: Application[] = [
    {
      id: 'ekyc',
      name: 'E-KYC Platform',
      description: 'Complete identity verification, document processing, and compliance checks for customers',
      isHighlighted: true,
      features: ['Identity Verification', 'Document Processing', 'Compliance Checks']
    },
    {
      id: 'sop',
      name: 'SOP Management',
      description: 'Access standard operating procedures and workflow documentation for your role',
      isHighlighted: false,
      features: ['Documentation', 'Workflows', 'Procedures']
    },
    {
      id: 'market-maps',
      name: 'Market Maps',
      description: 'View market intelligence reports and customer analytics for your region',
      isHighlighted: false,
      features: ['Analytics', 'Reports', 'Intelligence']
    }
  ];

  mockDocuments: Document[] = [
    { 
      id: '1', 
      name: 'Driver\'s License', 
      type: 'Identity Document', 
      status: 'verified', 
      uploadDate: '2024-01-15',
      expiryDate: '2026-01-15'
    },
    { 
      id: '2', 
      name: 'Passport', 
      type: 'Identity Document', 
      status: 'verified', 
      uploadDate: '2024-01-16',
      expiryDate: '2028-05-20'
    },
    { 
      id: '3', 
      name: 'Utility Bill', 
      type: 'Address Verification', 
      status: 'pending', 
      uploadDate: '2024-01-20',
      expiryDate: null
    },
    { 
      id: '4', 
      name: 'Bank Statement', 
      type: 'Financial Verification', 
      status: 'required', 
      uploadDate: null,
      expiryDate: null
    }
  ];

  mockTasks: Task[] = [
    { id: '1', title: 'Complete E-KYC Verification', priority: 'high', dueDate: '2024-02-05', completed: false },
    { id: '2', title: 'Update Address Information', priority: 'medium', dueDate: '2024-02-10', completed: false },
    { id: '3', title: 'Review SOP Documentation', priority: 'low', dueDate: '2024-02-15', completed: false },
  ];

  recentEKYCActivity: EKYCActivity[] = [
    { id: '1', type: 'Aadhaar', customer: 'RAHUL KUMAR', status: 'completed', time: '2 hours ago' },
    { id: '2', type: 'PAN', customer: 'ANJALI SINGH', status: 'in_progress', time: '4 hours ago' },
    { id: '3', type: 'Aadhaar', customer: 'VIKRAM SHAH', status: 'completed', time: '1 day ago' },
    { id: '4', type: 'PAN', customer: 'MEERA PATEL', status: 'pending', time: '2 days ago' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  handleLaunchApplication(appId: string): void {
    this.selectedApp = appId;
    if (appId === 'ekyc') {
      this.showEKYCApp = true;
    } else {
      this.activeTab = 'app-workspace';
    }
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

  getApplicationDescription(appId: string): string {
    const descriptions: { [key: string]: string } = {
      ekyc: 'Complete identity verification, document processing, and compliance checks for customers',
      sop: 'Access standard operating procedures and workflow documentation for your role',
      'market-maps': 'View market intelligence reports and customer analytics for your region',
      iam: 'Manage your account settings and access permissions within the organization',
      'api-workflows': 'Configure and monitor API integrations and workflows for your department'
    };
    return descriptions[appId] || 'Application workspace and tools for your daily tasks';
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'verified':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'required':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  }

  getBadgeVariant(status: string): string {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'required':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  getDocumentIconClass(status: string): string {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'required':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  }

  getDocumentBgClass(status: string): string {
    switch (status) {
      case 'verified':
        return 'bg-green-100';
      case 'pending':
        return 'bg-yellow-100';
      case 'required':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  }

  onLogout(): void {
    console.log('Logout clicked');
    // Clear any stored authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    // Redirect to login page
    window.location.href = '/login';
  }

  get pendingTasksCount(): number {
    return this.mockTasks.filter(t => !t.completed).length;
  }

  get pendingTasks(): Task[] {
    return this.mockTasks.filter(task => !task.completed);
  }

  get recentDocuments(): Document[] {
    return this.mockDocuments.filter(doc => doc.status !== 'required').slice(0, 3);
  }

  get selectedApplication(): Application | undefined {
    return this.assignedApplications.find(app => app.id === this.selectedApp);
  }

  openDocumentUploadModal() {
    this.showDocumentUploadModal = true;
  }

  closeDocumentUploadModal() {
    this.showDocumentUploadModal = false;
  }

  handleDocumentUpload(documentUpload: any) {
    // Add the new document to the mock documents
    const newDocument = {
      id: (this.mockDocuments.length + 1).toString(),
      name: documentUpload.name,
      type: documentUpload.type,
      status: 'pending',
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: null
    };
    this.mockDocuments.unshift(newDocument);
    this.showDocumentUploadModal = false;
  }
}
