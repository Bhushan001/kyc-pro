import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() organizationName: string = 'TechCorp Inc';
  @Input() userName: string = 'Admin User';
  @Input() userRole: string = 'Tenant Admin';
  @Output() logout = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchQuery: string = '';

  onLogout(): void {
    this.logout.emit();
  }

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }
} 