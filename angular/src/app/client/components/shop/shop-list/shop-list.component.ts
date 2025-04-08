import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { NotificationService } from '../../../../services/notification.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class ShopListComponent implements OnInit {
  products: Product[] = [];
  @Input() product: any;
  pagination = {
    currentPage: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 2,
  };
  sort = 'default';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.pagination.currentPage = +params['page'] || 1;
      this.sort = params['sort'] || 'default';
      this.fetchProducts();
    });
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
  }

  fetchProducts() {
    this.productService.fetchProducts(this.pagination.currentPage, this.sort)
      .subscribe({
        next: (response) => {
          this.products = response.products;
          this.pagination = {
            currentPage: response.currentPage,
            totalPages: response.totalPages,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
          };
        },
        error: (err) => console.error('Error fetching products:', err)
      });
  }

  changeSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
      queryParams: { page: 1, sort: value },
      queryParamsHandling: 'merge',
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
