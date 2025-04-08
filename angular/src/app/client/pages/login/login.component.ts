import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { log } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  alertMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  handleSubmitLogin() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.loginUser({ email, password } ).subscribe(
      response => {
        if (response.success) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          localStorage.setItem("wishlist", JSON.stringify(response.wishlist));

          window.location.href = "/";
        } else {
          this.alertMessage = response.message;
        }
      },
      error => {
        console.error("Error during login:", error);
        this.alertMessage = error.error?.message || "An unexpected error occurred. Please try again.";
      }
    );
  }

}
