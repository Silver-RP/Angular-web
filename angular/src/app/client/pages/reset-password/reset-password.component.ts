import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ResetPasswordComponent {
  token: string | null = null;
  password: string = '';
  passwordConfirmation: string = '';
  message: string = '';
  messageClass: string = 'text-red';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async handleResetPassword(event: Event) {
    event.preventDefault();

    if (!this.token) {
      this.message = 'Invalid or expired reset link.';
      return;
    }

    if (this.password !== this.passwordConfirmation) {
      this.message = 'Passwords do not match.';
      return;
    }

    try {
      const response = await this.authService.resetPassword(this.token, this.password, this.passwordConfirmation).toPromise();
      if (response?.success) {
        this.message = 'Password reset successfully. Please login.';
        this.messageClass = 'text-green';
        setTimeout(() => this.router.navigate(['/client/login']), 3000);
      } else {
        this.message = response?.message || 'Failed to reset password.';
      }
    } catch (error) {
      console.error('Failed to reset password', error);
      this.message = 'An error occurred. Please try again.';
    }
  }
}
