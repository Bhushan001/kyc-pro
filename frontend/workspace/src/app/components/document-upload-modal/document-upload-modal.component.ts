import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DocumentUpload {
  name: string;
  type: string;
  file: File | null;
}

@Component({
  selector: 'app-document-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Upload New Document</h3>
          <button 
            (click)="onClose()"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
            <select 
              [(ngModel)]="documentUpload.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select document type</option>
              <option value="Identity Document">Identity Document</option>
              <option value="Address Verification">Address Verification</option>
              <option value="Financial Verification">Financial Verification</option>
              <option value="Employment Verification">Employment Verification</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
            <input 
              type="text"
              [(ngModel)]="documentUpload.name"
              placeholder="Enter document name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p class="text-lg font-medium text-gray-900 mb-2">Upload Document</p>
              <p class="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
              <input 
                type="file" 
                accept="image/*,.pdf,.doc,.docx"
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
          </div>

          <div *ngIf="documentUpload.file" class="rounded-lg border bg-green-50 border-green-200 p-4">
            <div class="flex items-center space-x-3">
              <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <p class="text-sm font-medium text-green-900">File selected successfully</p>
                <p class="text-xs text-green-700">{{ documentUpload.file.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button 
            (click)="onClose()"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button 
            [disabled]="!documentUpload.name || !documentUpload.type || !documentUpload.file"
            (click)="onUpload()"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
          >
            Upload Document
          </button>
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
export class DocumentUploadModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() upload = new EventEmitter<DocumentUpload>();

  documentUpload: DocumentUpload = {
    name: '',
    type: '',
    file: null
  };

  onClose() {
    this.close.emit();
  }

  handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.documentUpload.file = file;
    }
  }

  onUpload() {
    if (this.documentUpload.name && this.documentUpload.type && this.documentUpload.file) {
      this.upload.emit(this.documentUpload);
      this.resetForm();
    }
  }

  resetForm() {
    this.documentUpload = {
      name: '',
      type: '',
      file: null
    };
  }
} 