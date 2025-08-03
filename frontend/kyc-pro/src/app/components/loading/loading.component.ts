import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullScreen: boolean = false;

  getSpinnerClasses(): string {
    const baseClasses = 'mx-auto';
    switch (this.size) {
      case 'sm':
        return `${baseClasses} w-6 h-6`;
      case 'lg':
        return `${baseClasses} w-12 h-12`;
      default:
        return `${baseClasses} w-8 h-8`;
    }
  }
}
