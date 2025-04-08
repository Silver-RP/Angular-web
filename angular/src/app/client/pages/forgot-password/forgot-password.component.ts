import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  messageClass: string = '';

  constructor(private authService: AuthService) {}

  async handleForgotPassword(event: Event) {
    event.preventDefault();
    this.message = 'Please wait...';

    try {
      const response = await this.authService.forgotPassword(this.email).toPromise();
      if (response?.success) {
        this.message = 'A reset password link has been sent to your email.';
        this.messageClass = 'text-green';
      } else {
        this.message = response?.message || 'Failed to send email.';
        this.messageClass = 'text-danger';
      }
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      this.message = 'An error occurred. Please try again.';
    }
  }
}
