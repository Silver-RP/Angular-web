import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../../../services/home.service';
import { CartService } from '../../../../services/cart.service';
import { NotificationService } from '../../../../services/notification.service';
import { from } from 'rxjs';


interface Product {
  _id: string;
  name: string;
  salePrice: number;
  price: number;
  images: string[];
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featuredProducts.component.html',
  styleUrls: ['./featuredProducts.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: Product[] = [];

  // constructor(private homeService: HomeService, private cartService: CartService) {}
  constructor(
    private homeService: HomeService,
    private cartService: CartService,
    private notificationService: NotificationService

    ) {}

  ngOnInit() {
    this.fetchFeaturedProducts();
  }

  fetchFeaturedProducts() {
    this.homeService.getHomeProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data.productsFeatured || [];
      },
      error: (err) => console.error('Error fetching featured products:', err),
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
