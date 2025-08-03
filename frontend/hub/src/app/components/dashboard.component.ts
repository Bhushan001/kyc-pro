import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  activeTab = 'overview';

  mockStats = {
    totalTenants: 124,
    totalUsers: 3456,
    monthlyVerifications: 28934,
    systemHealth: 99.9
  };

  mockTenants = [
    { id: '1', name: 'TechCorp Inc', users: 245, status: 'active', plan: 'Professional', lastActive: '2 hours ago' },
    { id: '2', name: 'Finance Solutions', users: 89, status: 'active', plan: 'Enterprise', lastActive: '1 day ago' },
    { id: '3', name: 'Healthcare Plus', users: 156, status: 'pending', plan: 'Starter', lastActive: '3 days ago' },
    { id: '4', name: 'Legal Associates', users: 67, status: 'active', plan: 'Professional', lastActive: '5 hours ago' },
  ];

  mockAlerts = [
    { id: '1', type: 'warning', message: 'High verification volume detected for TechCorp Inc', time: '10 minutes ago' },
    { id: '2', type: 'info', message: 'New tenant signup: Digital Ventures', time: '2 hours ago' },
    { id: '3', type: 'error', message: 'API rate limit exceeded for Finance Solutions', time: '1 day ago' },
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
