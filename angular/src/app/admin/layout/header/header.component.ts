import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async handleLogout() {
    try {
      const response = await this.authService.logoutUser().toPromise();
      if (response?.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("wishlist");
        this.router.navigate(['/client/login']).then(() => {
          window.location.reload(); 
        });
      } else {
        console.error("Error logging out:", response?.message);
        alert("Error logging out: " + response?.message);
      }
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  }
  
}