import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';
import { StatsCardComponent } from './stats-card.component';

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
  type: string;
  status: string;
  date: string;
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
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, SidebarComponent, StatsCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = 'dashboard';
  
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
  ];

  mockVerifications: Verification[] = [
    { id: '1', user: 'Alice Johnson', type: 'Identity Document', status: 'completed', date: '2 hours ago' },
    { id: '2', user: 'Bob Smith', type: 'Address Verification', status: 'pending', date: '1 day ago' },
    { id: '3', user: 'Carol Davis', type: 'Enhanced Due Diligence', status: 'in_review', date: '3 hours ago' },
    { id: '4', user: 'David Wilson', type: 'Identity Document', status: 'completed', date: '1 hour ago' },
  ];

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
      default:
        return 'secondary';
    }
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
} 