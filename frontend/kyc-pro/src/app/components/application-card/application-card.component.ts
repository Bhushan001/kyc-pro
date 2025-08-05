import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from '../../shared/interfaces/landing.interface';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent {
  @Input() application!: Application;

  getIconBgClass(): string {
    switch (this.application.color) {
      case 'blue':
        return 'bg-blue-600';
      case 'green':
        return 'bg-green-600';
      case 'purple':
        return 'bg-purple-600';
      case 'orange':
        return 'bg-orange-600';
      case 'red':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  }

  getButtonClass(): string {
    if (this.application.isHighlighted) {
      return 'bg-blue-600 text-white hover:bg-blue-700';
    }
    return 'border border-border text-muted-foreground hover:bg-muted';
  }
} 