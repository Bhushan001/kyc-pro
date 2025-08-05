import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoUser } from '../../shared/interfaces/landing.interface';

@Component({
  selector: 'app-demo-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo-user-card.component.html',
  styleUrls: ['./demo-user-card.component.css']
})
export class DemoUserCardComponent {
  @Input() user!: DemoUser;
  @Output() onDemoLogin = new EventEmitter<DemoUser>();

  getRoleIconClass(): string {
    switch (this.user.role) {
      case 'platform_admin':
        return 'bg-blue-600';
      case 'platform_tenant_admin':
        return 'bg-purple-600';
      case 'platform_user':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  }

  getRoleBadgeClass(): string {
    switch (this.user.role) {
      case 'platform_admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'platform_tenant_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'platform_user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getRoleDisplayName(): string {
    return this.user.role
      .replace('platform_', '')
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getOrganizationName(): string {
    switch (this.user.tenantId) {
      case 'icici-bank':
        return 'ICICI Bank';
      default:
        return this.user.tenantId || '';
    }
  }

  getApplicationDisplayName(app: string): string {
    switch (app) {
      case 'ekyc':
        return 'E-KYC';
      case 'sop':
        return 'SOP';
      case 'iam':
        return 'IAM';
      default:
        return app;
    }
  }

  getButtonClass(): string {
    switch (this.user.role) {
      case 'platform_admin':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'platform_tenant_admin':
        return 'bg-purple-600 text-white hover:bg-purple-700';
      case 'platform_user':
        return 'bg-green-600 text-white hover:bg-green-700';
      default:
        return 'bg-gray-600 text-white hover:bg-gray-700';
    }
  }

  getButtonText(): string {
    switch (this.user.role) {
      case 'platform_admin':
        return 'View Hub Dashboard';
      case 'platform_tenant_admin':
        return 'View Console Dashboard';
      case 'platform_user':
        return 'View Workspace Dashboard';
      default:
        return 'View Dashboard';
    }
  }
} 