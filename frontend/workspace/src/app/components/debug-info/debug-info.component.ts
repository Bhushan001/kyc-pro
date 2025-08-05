import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-debug-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700">Debug Info</span>
        </div>
        <span class="text-xs text-gray-500">Development Mode</span>
      </div>
      <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <p class="text-gray-600"><strong>User:</strong> {{ user?.name }} ({{ user?.email }})</p>
          <p class="text-gray-600"><strong>Role:</strong> {{ user?.role }}</p>
        </div>
        <div>
          <p class="text-gray-600"><strong>Tenant:</strong> {{ tenant?.name }}</p>
          <p class="text-gray-600"><strong>Type:</strong> {{ tenant?.type }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DebugInfoComponent {
  @Input() user: User | null = null;
  @Input() tenant: Tenant | null = null;
} 