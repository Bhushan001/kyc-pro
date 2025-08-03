import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

interface Profile {
  completionProgress: number;
  documentsUploaded: number;
  verificationStatus: string;
  lastUpdate: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = 'overview';
  
  mockProfile: Profile = {
    completionProgress: 75,
    documentsUploaded: 3,
    verificationStatus: 'in_progress',
    lastUpdate: '2 days ago'
  };

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
    { id: '1', title: 'Upload Bank Statement', priority: 'high', dueDate: '2024-02-05', completed: false },
    { id: '2', title: 'Update Address Information', priority: 'medium', dueDate: '2024-02-10', completed: false },
    { id: '3', title: 'Complete Enhanced Verification', priority: 'low', dueDate: '2024-02-15', completed: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
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
    // Add logout logic here
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
}
