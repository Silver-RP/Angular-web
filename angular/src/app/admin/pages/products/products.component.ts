import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service'; 
import { PaginationComponent } from "../../components/common/pagination/pagination.component";

interface Product {
  id: number;
  _id: string;
  name: string;
  cateName: string;
  salePrice: number;
  price: number;
  images: string[];
  sku: string;
  category: string;
  brand: string;
  featured: boolean;
  stockStatus: string;
  quantity: number;
  saledQuantity: number;
  description: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [RouterModule, PaginationComponent, CommonModule]
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  pagination = {
    currentPage: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 2
  };
  searchParams = {
    page: 1,
    sort: 'default'
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchParams.page = +params['page'] || 1;
      this.searchParams.sort = params['sort'] || 'default';
      this.fetchProducts();
    });
  }

  fetchProducts() {
    const { page, sort } = this.searchParams;
    this.productService.fetchProducts(page, sort).subscribe(
      response => {
        this.products = response.products;
        this.pagination = {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          prevPage: response.prevPage,
          nextPage: response.nextPage
        };
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  handleDelete(productId: string) {
    if (window.confirm('Are you sure you want to delete this item?')) {
      this.productService.deleteProduct(productId).subscribe(
        result => {
          if (result.success) {
            alert('Product deleted successfully!');
            this.fetchProducts(); 
          } else {
            alert(result.message || 'Failed to delete product.');
          }
        },
        error => {
          console.error('Error deleting product:', error);
          const errorMessage = error.error?.message || 'An unexpected error occurred.';
          alert(errorMessage);
        }
      );
    }
  }

  onPageChange(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, sort: this.searchParams.sort }
    });
  }
}
