import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PricingTier } from '../../shared/interfaces/landing.interface';

@Component({
  selector: 'app-pricing-tier',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pricing-tier.component.html',
  styleUrls: ['./pricing-tier.component.css']
})
export class PricingTierComponent {
  @Input() tier!: PricingTier;

  getButtonClass(): string {
    if (this.tier.popular) {
      return 'bg-blue-600 text-white hover:bg-blue-700';
    }
    return 'border border-border text-muted-foreground hover:bg-muted';
  }
} 