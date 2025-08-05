import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserInfo {
  name: string;
  organization: string;
}

interface DocumentData {
  type: 'aadhaar' | 'pan';
  number: string;
  name: string;
  fatherName?: string;
  dob: string;
  address?: string;
  panNumber?: string;
  aadhaarNumber?: string;
}

interface VerificationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  details?: string;
}

@Component({
  selector: 'app-ekyc-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Header -->
      <header class="bg-card border-b border-border px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button (click)="onClose()" class="text-muted-foreground hover:text-foreground">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span class="text-2xl font-bold text-foreground">E-KYC Verification</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-muted-foreground">{{ userInfo?.name }}</p>
            <p class="text-xs text-muted-foreground">{{ userInfo?.organization }}</p>
          </div>
        </div>
      </header>

      <div class="p-6">
        <!-- Document Selection -->
        <div *ngIf="currentStep === 'selection'" class="space-y-6">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-foreground mb-2">Select Document Type</h1>
            <p class="text-muted-foreground">Choose the type of document you want to verify</p>
          </div>

          <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div class="rounded-lg border bg-card cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                 [class]="selectedDocType === 'aadhaar' ? 'border-blue-500' : 'border-border'"
                 (click)="handleDocumentTypeSelection('aadhaar')">
              <div class="p-6 text-center">
                <svg class="h-16 w-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <h3 class="text-xl font-semibold text-foreground mb-2">Aadhaar Card</h3>
                <p class="text-muted-foreground mb-4">
                  Verify identity using Aadhaar card with biometric authentication
                </p>
              </div>
              <div class="px-6 pb-6">
                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">UIDAI Database Verification</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Biometric Authentication</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Address Verification</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Real-time Validation</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-lg border bg-card cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                 [class]="selectedDocType === 'pan' ? 'border-blue-500' : 'border-border'"
                 (click)="handleDocumentTypeSelection('pan')">
              <div class="p-6 text-center">
                <svg class="h-16 w-16 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <h3 class="text-xl font-semibold text-foreground mb-2">PAN Card</h3>
                <p class="text-muted-foreground mb-4">
                  Verify identity using PAN card for financial compliance
                </p>
              </div>
              <div class="px-6 pb-6">
                <div class="space-y-2">
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Income Tax Dept. Verification</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Financial Compliance</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Quick Processing</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Instant Results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <button 
              [disabled]="!selectedDocType"
              (click)="setCurrentStep('upload')"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
            >
              Continue
            </button>
          </div>
        </div>

        <!-- Document Upload -->
        <div *ngIf="currentStep === 'upload'" class="max-w-2xl mx-auto space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-foreground mb-2">Upload Document</h2>
            <p class="text-muted-foreground">Upload your {{ selectedDocType === 'aadhaar' ? 'Aadhaar' : 'PAN' }} card</p>
          </div>

          <div class="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="text-lg font-medium text-foreground mb-2">Upload Document</p>
            <p class="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
            <input 
              type="file" 
              accept="image/*,.pdf"
              (change)="handleFileUpload($event)"
              class="hidden"
              #fileInput
            />
            <button 
              (click)="fileInput.click()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              Choose File
            </button>
          </div>

          <div *ngIf="uploadedFile" class="rounded-lg border bg-green-50 border-green-200 p-4">
            <div class="flex items-center space-x-3">
              <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <p class="text-sm font-medium text-green-900">File uploaded successfully</p>
                <p class="text-xs text-green-700">{{ uploadedFile.name }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-center space-x-4">
            <button 
              (click)="setCurrentStep('selection')"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Back
            </button>
            <button 
              [disabled]="!uploadedFile"
              (click)="startVerificationProcess()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
            >
              Start Verification
            </button>
          </div>
        </div>

        <!-- Processing -->
        <div *ngIf="currentStep === 'processing'" class="max-w-2xl mx-auto space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-foreground mb-2">Processing Document</h2>
            <p class="text-muted-foreground">Please wait while we verify your document</p>
          </div>

          <div class="space-y-4">
            <div *ngFor="let step of verificationSteps" class="rounded-lg border bg-card p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="h-8 w-8 rounded-full flex items-center justify-center"
                       [class]="step.status === 'completed' ? 'bg-green-100' : 
                               step.status === 'processing' ? 'bg-blue-100' : 
                               step.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'">
                    <svg *ngIf="step.status === 'completed'" class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <svg *ngIf="step.status === 'processing'" class="h-4 w-4 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    <svg *ngIf="step.status === 'failed'" class="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <svg *ngIf="step.status === 'pending'" class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-foreground">{{ step.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ step.description }}</p>
                  </div>
                </div>
                <span class="text-xs text-muted-foreground capitalize">{{ step.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Biometric Step -->
        <div *ngIf="currentStep === 'biometric'" class="max-w-2xl mx-auto space-y-6">
          <div class="text-center">
            <h2 class="text-3xl font-bold text-foreground mb-2">Biometric Verification</h2>
            <p class="text-muted-foreground">
              Please complete fingerprint authentication for Aadhaar verification
            </p>
          </div>

          <div class="rounded-lg border bg-card p-6">
            <div class="text-center space-y-6">
              <div class="relative inline-block">
                <div class="h-32 w-32 rounded-full mx-auto flex items-center justify-center transition-all"
                     [class]="biometricVerified ? 'bg-green-100 border-4 border-green-500' : 'bg-blue-50 border-4 border-blue-300 animate-pulse'">
                  <svg class="h-16 w-16" 
                       [class]="biometricVerified ? 'text-green-600' : 'text-blue-600'"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                  </svg>
                </div>
                <div *ngIf="biometricVerified" class="h-8 w-8 text-green-600 absolute -top-2 -right-2 bg-white rounded-full flex items-center justify-center">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>

              <div *ngIf="!biometricVerified" class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p class="text-blue-800 text-sm">
                    Please place your finger on the biometric scanner and hold steady
                  </p>
                </div>
                <button 
                  (click)="handleBiometricVerification()"
                  [disabled]="isProcessing"
                  class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                >
                  <svg *ngIf="isProcessing" class="mr-2 h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <svg *ngIf="!isProcessing" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                  </svg>
                  {{ isProcessing ? 'Authenticating...' : 'Start Biometric Scan' }}
                </button>
              </div>

              <div *ngIf="biometricVerified" class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div class="flex items-center justify-center space-x-2 mb-2">
                  <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-green-800 font-medium">Biometric verification successful</span>
                </div>
                <p class="text-green-700 text-sm">Your fingerprint has been matched with Aadhaar database</p>
              </div>

              <div class="space-y-2 text-sm text-muted-foreground">
                <div class="flex items-center space-x-2">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span>Secure biometric matching</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span>No biometric data is stored</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span>UIDAI compliant verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div *ngIf="currentStep === 'results'" class="max-w-4xl mx-auto space-y-6">
          <div class="text-center">
            <div *ngIf="verificationResult === 'success'" class="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div *ngIf="verificationResult === 'failed'" class="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-2">
              {{ verificationResult === 'success' ? 'Verification Successful' : 'Verification Failed' }}
            </h2>
            <p class="text-muted-foreground">
              {{ verificationResult === 'success' ? 'Your document has been verified successfully' : 'There was an issue with the verification process' }}
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <!-- Verification Summary -->
            <div class="rounded-lg border bg-card p-6">
              <h3 class="font-medium text-foreground mb-4 flex items-center space-x-2">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>Verification Summary</span>
              </h3>
              <div class="space-y-4">
                <div *ngFor="let step of verificationSteps" class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <svg *ngIf="step.status === 'completed'" class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <svg *ngIf="step.status === 'failed'" class="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <div>
                      <p class="font-medium text-foreground">{{ step.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ step.description }}</p>
                    </div>
                  </div>
                  <span class="text-xs text-muted-foreground capitalize">{{ step.status }}</span>
                </div>
              </div>
            </div>

            <!-- Extracted Data -->
            <div *ngIf="documentData" class="rounded-lg border bg-card p-6">
              <h3 class="font-medium text-foreground mb-4 flex items-center space-x-2">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Extracted Data</span>
              </h3>
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">
                    {{ selectedDocType === 'aadhaar' ? 'Aadhaar Number' : 'PAN Number' }}
                  </p>
                  <p class="text-foreground font-mono">{{ documentData.number }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Name</p>
                  <p class="text-foreground">{{ documentData.name }}</p>
                </div>
                <div *ngIf="documentData.fatherName">
                  <p class="text-sm font-medium text-muted-foreground">Father's Name</p>
                  <p class="text-foreground">{{ documentData.fatherName }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p class="text-foreground">{{ documentData.dob }}</p>
                </div>
                <div *ngIf="documentData.address">
                  <p class="text-sm font-medium text-muted-foreground">Address</p>
                  <p class="text-foreground text-sm">{{ documentData.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center space-x-4">
            <button 
              (click)="restartProcess()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Start New Verification
            </button>
            <button 
              (click)="downloadReport()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
            >
              <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .bg-background {
      background-color: #ffffff;
    }
    
    .bg-card {
      background-color: #ffffff;
    }
    
    .text-foreground {
      color: #111827;
    }
    
    .text-muted-foreground {
      color: #6b7280;
    }
    
    .border-border {
      border-color: #e5e7eb;
    }
    
    .bg-blue-600 {
      background-color: #2563eb;
    }
    
    .hover\\:bg-blue-700:hover {
      background-color: #1d4ed8;
    }
    
    .text-blue-600 {
      color: #2563eb;
    }
    
    .bg-green-100 {
      background-color: #dcfce7;
    }
    
    .text-green-600 {
      color: #16a34a;
    }
    
    .bg-green-50 {
      background-color: #f0fdf4;
    }
    
    .border-green-200 {
      border-color: #bbf7d0;
    }
    
    .text-green-900 {
      color: #14532d;
    }
    
    .text-green-700 {
      color: #15803d;
    }
    
    .bg-red-100 {
      background-color: #fee2e2;
    }
    
    .text-red-600 {
      color: #dc2626;
    }
    
    .bg-gray-100 {
      background-color: #f3f4f6;
    }
    
    .text-gray-400 {
      color: #9ca3af;
    }
    
    .text-gray-500 {
      color: #6b7280;
    }
    
    .text-gray-700 {
      color: #374151;
    }
    
    .text-gray-900 {
      color: #111827;
    }
    
    .border-gray-200 {
      border-color: #e5e7eb;
    }
    
    .border-gray-300 {
      border-color: #d1d5db;
    }
    
    .bg-white {
      background-color: #ffffff;
    }
    
    .bg-blue-50 {
      background-color: #eff6ff;
    }
    
    .border-blue-500 {
      border-color: #3b82f6;
    }
    
    .bg-green-50 {
      background-color: #f0fdf4;
    }
    
    .border-green-200 {
      border-color: #bbf7d0;
    }
    
    .bg-muted {
      background-color: #f9fafb;
    }
    
    .text-muted-foreground {
      color: #6b7280;
    }
    
    .bg-muted\\/30 {
      background-color: rgba(249, 250, 251, 0.3);
    }
    
    .bg-muted\\/50 {
      background-color: rgba(249, 250, 251, 0.5);
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class EKYCApplicationComponent {
  @Input() userInfo: UserInfo | null = null;
  @Output() close = new EventEmitter<void>();

  currentStep: 'selection' | 'upload' | 'processing' | 'verification' | 'biometric' | 'results' = 'selection';
  selectedDocType: 'aadhaar' | 'pan' | null = null;
  uploadedFile: File | null = null;
  documentData: DocumentData | null = null;
  verificationSteps: VerificationStep[] = [];
  isProcessing = false;
  verificationResult: 'success' | 'failed' | null = null;
  biometricVerified = false;

  aadhaarMockData: DocumentData = {
    type: 'aadhaar',
    number: '1234 5678 9012',
    name: 'PRIYA SHARMA',
    fatherName: 'RAJESH SHARMA',
    dob: '15/03/1990',
    address: '123, MG Road, Bandra West, Mumbai - 400050, Maharashtra'
  };

  panMockData: DocumentData = {
    type: 'pan',
    number: 'ABCDE1234F',
    name: 'PRIYA SHARMA',
    fatherName: 'RAJESH SHARMA',
    dob: '15/03/1990',
    panNumber: 'ABCDE1234F'
  };

  onClose() {
    this.close.emit();
  }

  setCurrentStep(step: 'selection' | 'upload' | 'processing' | 'verification' | 'biometric' | 'results') {
    this.currentStep = step;
  }

  handleDocumentTypeSelection(type: 'aadhaar' | 'pan') {
    this.selectedDocType = type;
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  startVerificationProcess() {
    this.setCurrentStep('processing');
    this.initializeVerificationSteps();
    
    // Simulate processing steps
    setTimeout(() => {
      this.verificationSteps[1].status = 'completed';
      this.verificationSteps[2].status = 'processing';
    }, 2000);

    setTimeout(() => {
      this.verificationSteps[2].status = 'completed';
      this.verificationSteps[3].status = 'processing';
    }, 4000);

    setTimeout(() => {
      this.verificationSteps[3].status = 'completed';
      
      if (this.selectedDocType === 'aadhaar') {
        // For Aadhaar, go to biometric step
        this.setCurrentStep('biometric');
      } else {
        // For PAN, complete directly
        this.verificationSteps[4].status = 'completed';
        this.documentData = this.panMockData;
        this.verificationResult = 'success';
        this.setCurrentStep('results');
      }
    }, 6000);
  }

  handleBiometricVerification() {
    this.isProcessing = true;
    
    setTimeout(() => {
      this.biometricVerified = true;
      this.verificationSteps[4].status = 'completed';
      
      setTimeout(() => {
        this.verificationSteps[5].status = 'completed';
        this.documentData = this.aadhaarMockData;
        this.verificationResult = 'success';
        this.setCurrentStep('results');
        this.isProcessing = false;
      }, 1500);
    }, 3000);
  }

  initializeVerificationSteps() {
    const baseSteps: VerificationStep[] = [
      {
        id: 'upload',
        name: 'Document Upload',
        status: 'completed' as const,
        description: 'Document successfully uploaded',
        details: 'File validated and accepted'
      },
      {
        id: 'ocr',
        name: 'OCR Processing',
        status: 'processing' as const,
        description: 'Extracting data from document',
        details: 'AI-powered text recognition in progress'
      },
      {
        id: 'validation',
        name: 'Data Validation',
        status: 'pending' as const,
        description: 'Validating extracted information',
        details: 'Checking format and authenticity'
      },
      {
        id: 'govt_verify',
        name: 'Government Verification',
        status: 'pending' as const,
        description: this.selectedDocType === 'aadhaar' ? 'UIDAI verification' : 'Income Tax Department verification',
        details: 'Verifying with official database'
      }
    ];

    if (this.selectedDocType === 'aadhaar') {
      baseSteps.push({
        id: 'biometric',
        name: 'Biometric Verification',
        status: 'pending' as const,
        description: 'Fingerprint authentication required',
        details: 'Place finger on scanner for verification'
      });
    }

    baseSteps.push({
      id: 'final',
      name: 'Verification Complete',
      status: 'pending' as const,
      description: 'Final verification step',
      details: 'Completing verification process'
    });

    this.verificationSteps = baseSteps;
  }

  downloadReport() {
    // Simulate download
    console.log('Downloading verification report...');
  }

  restartProcess() {
    this.currentStep = 'selection';
    this.selectedDocType = null;
    this.uploadedFile = null;
    this.documentData = null;
    this.verificationSteps = [];
    this.verificationResult = null;
    this.biometricVerified = false;
  }
} 