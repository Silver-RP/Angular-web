import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../../components/common/search/search.component';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent]
  
})

export class HeaderComponent {
  token: string | null = localStorage.getItem('token');
  userData: { name: string; email?: string } | null = null;
  cartCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe((cart) => {
      this.cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    });
    try {
      const user = localStorage.getItem('user');
      this.userData = user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.userData = null;
    }
  }

  ngOnInit() {
  }
}
