import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Tenant {
  id: string;
  name: string;
  type: string;
  industry: string;
  status: string;
  users: any[];
  monthlyRevenue: number;
  tenantAdminId?: string;
  subscribedApplications: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string | null;
  assignedApplications?: string[];
}

interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  monthlyPrice: number;
  features: string[];
}

@Component({
  selector: 'app-tenant-management-modal',
  templateUrl: './tenant-management-modal.component.html',
  styleUrls: ['./tenant-management-modal.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TenantManagementModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() tenant: Tenant | null = null;
  @Input() users: User[] = [];
  @Input() applications: Application[] = [];
  @Output() onClose = new EventEmitter<void>();
  @Output() onAssignTenantAdmin = new EventEmitter<{tenantId: string, userId: string}>();

  tenantForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      industry: ['', Validators.required],
      status: ['', Validators.required],
      tenantAdminId: [''],
      subscribedApplications: [[]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges called:', changes);
    if (changes['tenant'] && this.tenant) {
      console.log('Populating form with tenant data:', this.tenant);
      this.tenantForm.patchValue({
        name: this.tenant.name,
        type: this.tenant.type,
        industry: this.tenant.industry,
        status: this.tenant.status,
        tenantAdminId: this.tenant.tenantAdminId || '',
        subscribedApplications: this.tenant.subscribedApplications || []
      });
      console.log('Form populated successfully');
    }
  }

  handleClose() {
    this.onClose.emit();
  }

  handleAssignAdmin() {
    const tenantAdminId = this.tenantForm.get('tenantAdminId')?.value;
    if (tenantAdminId && this.tenant) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.onAssignTenantAdmin.emit({
          tenantId: this.tenant!.id,
          userId: tenantAdminId
        });
        this.isLoading = false;
        alert('Tenant admin assigned successfully!');
      }, 1000);
    }
  }

  handleSaveChanges() {
    if (this.tenantForm.valid) {
      this.isLoading = true;
      
      // Simulate API call to save tenant changes
      setTimeout(() => {
        // Here you would typically make an API call to save the tenant data
        console.log('Saving tenant changes:', this.tenantForm.value);
        
        this.isLoading = false;
        alert('Tenant changes saved successfully!');
        
        // Close the modal after successful save
        this.handleClose();
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.tenantForm.controls).forEach(key => {
        const control = this.tenantForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  handleApplicationToggle(appId: string) {
    const currentApps = this.tenantForm.get('subscribedApplications')?.value || [];
    const index = currentApps.indexOf(appId);
    
    if (index > -1) {
      currentApps.splice(index, 1);
    } else {
      currentApps.push(appId);
    }
    
    this.tenantForm.patchValue({ subscribedApplications: currentApps });
  }

  getApplicationName(appId: string): string {
    const app = this.applications.find(a => a.id === appId);
    return app?.name || appId;
  }

  getApplicationPrice(appId: string): number {
    const app = this.applications.find(a => a.id === appId);
    return app?.monthlyPrice || 0;
  }

  getTotalMonthlyCost(): number {
    const selectedApps = this.tenantForm.get('subscribedApplications')?.value || [];
    return selectedApps.reduce((total: number, appId: string) => {
      const app = this.applications.find(a => a.id === appId);
      return total + (app?.monthlyPrice || 0);
    }, 0);
  }

  getAvailableUsers(): User[] {
    return this.users.filter(user => 
      (user.role === 'platform_tenant_admin' || user.role === 'platform_user') && 
      (!user.tenantId || user.tenantId === this.tenant?.id)
    );
  }

  getCurrentTenantAdmin(): User | undefined {
    if (!this.tenant?.tenantAdminId) return undefined;
    return this.users.find(u => u.id === this.tenant?.tenantAdminId);
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'platform_tenant_admin': return 'Tenant Admin';
      case 'platform_user': return 'User';
      case 'platform_admin': return 'Platform Admin';
      default: return role.replace('platform_', '').replace('_', ' ');
    }
  }
} 