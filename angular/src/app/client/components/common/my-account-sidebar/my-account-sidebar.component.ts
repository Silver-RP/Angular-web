import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account-sidebar',
  templateUrl: './my-account-sidebar.component.html',
  styleUrls: ['./my-account-sidebar.component.css'],
  host: { 'class': 'col-lg-3' },
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MyAccountSidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  handleLogout() {
    this.authService.logoutUser().subscribe(
      (response: any) => {
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
      },
      (error) => {
        console.error("Unexpected error during logout:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    );
  }
}
