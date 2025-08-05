import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-background-svg',
  standalone: true,
  template: `
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#eff6ff" stop-opacity="0.3" />
          <stop offset="50%" stop-color="#faf5ff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#f0f9ff" stop-opacity="0.3" />
        </linearGradient>
        <radialGradient id="circle-gradient-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="circle-gradient-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Background -->
      <rect width="1200" height="800" fill="url(#bg-gradient)" />

      <!-- Floating circles -->
      <circle cx="200" cy="150" r="80" fill="url(#circle-gradient-1)" opacity="0.6" />
      <circle cx="1000" cy="200" r="60" fill="url(#circle-gradient-2)" opacity="0.4" />
      <circle cx="150" cy="600" r="100" fill="url(#circle-gradient-1)" opacity="0.3" />
      <circle cx="900" cy="650" r="70" fill="url(#circle-gradient-2)" opacity="0.5" />
      <circle cx="600" cy="100" r="50" fill="url(#circle-gradient-1)" opacity="0.4" />
      <circle cx="500" cy="700" r="90" fill="url(#circle-gradient-2)" opacity="0.3" />

      <!-- Abstract shapes -->
      <path
        d="M0 400 Q300 200 600 400 T1200 400"
        stroke="#3b82f6"
        stroke-width="2"
        fill="none"
        opacity="0.1"
      />
      <path
        d="M0 500 Q300 300 600 500 T1200 500"
        stroke="#8b5cf6"
        stroke-width="2"
        fill="none"
        opacity="0.1"
      />

      <!-- Grid pattern -->
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" stroke-width="0.5" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#grid)" />
    </svg>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }
  `]
})
export class AuthBackgroundSvgComponent {} 