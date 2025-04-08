// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  alertMessage: string = '';
  messageClass: string = '';
  showPassword: boolean = false;
  showpassword_confirmation: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(0[2-9]|84[2-9])[0-9]{8}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) 
      ]],
      password_confirmation: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  togglepassword_confirmationVisibility() {
    this.showpassword_confirmation = !this.showpassword_confirmation;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log("Form is invalid, stopping execution.");
      return;
    }
  
    this.alertMessage = 'Please wait...';
  
    this.authService.registerUser(this.registerForm.value).subscribe(
      response => {
        if (response.success) {
          this.alertMessage = response.message;
          this.messageClass = 'text-green';
          setTimeout(() => this.router.navigate(['/client/login']), 5000);
        } else {
          this.alertMessage = response.message || 'Registration failed';
          this.messageClass = 'text-red';
        }
      },
      error => { 
        console.error('Error:', error);
        // Kiểm tra nếu error có message từ API
        this.alertMessage = error.error?.message || 'Something went wrong!';
        this.messageClass = 'text-red';
      }
    );
  }
  
}