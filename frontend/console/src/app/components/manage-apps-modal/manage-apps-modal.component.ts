import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

interface Application {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  isHighlighted: boolean;
  features: string[];
}

@Component({
  selector: 'app-manage-apps-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-apps-modal.component.html',
  styleUrls: ['./manage-apps-modal.component.css']
})
export class ManageAppsModalComponent {
  @Input() isOpen = false;
  @Input() user: User | null = null;
  @Input() availableApplications: Application[] = [];
  @Input() currentAccess: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() updateAccessEvent = new EventEmitter<{userId: string, applicationIds: string[]}>();

  selectedApplications: string[] = [];
  isUpdating = false;

  ngOnInit() {
    this.selectedApplications = [...this.currentAccess];
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.selectedApplications = [...this.currentAccess];
    }
  }

  onClose() {
    this.close.emit();
  }

  toggleApplication(appId: string) {
    if (this.selectedApplications.includes(appId)) {
      this.selectedApplications = this.selectedApplications.filter(id => id !== appId);
    } else {
      this.selectedApplications = [...this.selectedApplications, appId];
    }
  }

  hasChanges(): boolean {
    const current = [...this.currentAccess].sort();
    const selected = [...this.selectedApplications].sort();
    return JSON.stringify(current) !== JSON.stringify(selected);
  }

  getApplicationName(appId: string): string {
    const app = this.availableApplications.find(a => a.id === appId);
    return app ? app.name : appId;
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

  updateAccess() {
    if (!this.user || !this.hasChanges()) return;
    
    this.isUpdating = true;
    
    // Simulate API call
    setTimeout(() => {
      this.updateAccessEvent.emit({
        userId: this.user!.id,
        applicationIds: this.selectedApplications
      });
      this.isUpdating = false;
      this.onClose();
    }, 1000);
  }
} 