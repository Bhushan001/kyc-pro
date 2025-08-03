import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  
  currentUser$ = this.authService.currentUser$;
  isLoading = false;
  isEditing = false;
  successMessage = '';

  profileForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    country: ['', Validators.required]
  });

  ngOnInit() {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          email: user.email || '',
          dateOfBirth: '',
          country: ''
        });
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
  }

  onSave() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      // Mock save - in real app, this would call an API
      setTimeout(() => {
        this.isLoading = false;
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }, 1000);
    }
  }

  onCancel() {
    this.isEditing = false;
    this.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          email: user.email || '',
          dateOfBirth: '',
          country: ''
        });
      }
    });
  }
}
