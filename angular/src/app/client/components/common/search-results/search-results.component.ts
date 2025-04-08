import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeadComponent } from '../../../layout/head/head.component';
import { ShopSidebarComponent } from '../../shop/shop-sidebar/shop-sidebar.component';
import { CartService } from '../../../../services/cart.service';
import { NotificationService } from '../../../../services/notification.service';
import { from } from 'rxjs';

interface Product {
  _id: string;
  name: string;
  cateName: string;
  salePrice: number;
  price: number;
  images: string[];
}


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  standalone: true,
  imports: [HeadComponent, ShopSidebarComponent, RouterModule, CommonModule]
})
export class SearchResultsComponent implements OnInit {
  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private notificationService: NotificationService
    ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(() => {
      const receivedState = history.state;
      this.products = Array.isArray(receivedState.products) ? receivedState.products : [];
    });
  }

  addToCart(product: Product) {
    if (!product || !product._id) {
      console.error("Product is undefined:", product);
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }
  
    from(this.cartService.addToCart(product._id, 1)).subscribe({
      next: (response) => {
        // console.log("Cart response:", response);
        this.notificationService.showNotification('Product added to cart!', 'success');
      },
      error: (error) => {
        console.error("Error adding to cart:", error);
        this.notificationService.showNotification('Failed to add product to cart.', 'error');
      }
    });
  }
  
}

