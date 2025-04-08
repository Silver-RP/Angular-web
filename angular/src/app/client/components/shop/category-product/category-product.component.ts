import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { HeadComponent } from '../../../layout/head/head.component';
import { ShopSidebarComponent } from '../shop-sidebar/shop-sidebar.component';
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

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-category-product',
  templateUrl: './category-product.component.html',
  styleUrls: ['./category-product.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeadComponent, ShopSidebarComponent],
})
export class CategoryProductComponent implements OnInit {
  products: Product[] = [];
  category: Category | null = null;
  categoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      if (this.categoryId) {
        this.fetchProductsByCategory(this.categoryId);
      }
    });
  }

  fetchProductsByCategory(id: string) {
    this.productService.getProductsByCategory(id).subscribe(
      response => {
        this.products = response.products;
        this.category = response.productCate;
      },
      error => console.error('Error fetching products:', error)
    );
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
