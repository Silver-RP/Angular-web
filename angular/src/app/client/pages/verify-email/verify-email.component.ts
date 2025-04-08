import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  message: string = 'Verifying your email...';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.verifyUserEmail(token);
    } else {
      this.message = 'Invalid or missing token.';
    }
  }

  async verifyUserEmail(token: string) {
    try {
      const response = await this.authService.verifyEmailRequest(token).toPromise();
      if (response?.success) {
        this.message = 'Email verified successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/client/login']), 5000);
      } else {
        this.message = response?.message || 'Invalid or expired token.';
      }
    } catch (error) {
      this.message = 'Something went wrong. Please try again.';
    }
  }
}
