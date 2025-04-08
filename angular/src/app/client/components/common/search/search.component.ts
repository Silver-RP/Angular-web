import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SearchComponent {
  keyword: string = '';
  products: any[] = [];
  searchTerm$ = new Subject<string>();
  showSearchResults = false;
  isSearchOpen = false;

  constructor(private productService: ProductService, private router: Router) {
    this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(keyword => {
      if (keyword.trim()) {
        this.fetchProducts(keyword);
      } else {
        this.products = [];
      }
    });
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.clearSearch();
    }
  }

  onSearchChange() {
    this.searchTerm$.next(this.keyword);
  }

  fetchProducts(keyword: string) {
    this.productService.searchProducts(keyword).subscribe({
      next: (response) => {
        this.products = response.products;
        this.showSearchResults = true;
      },
      error: (error) => {
        console.error("Search error:", error);
        if (error.status === 404) {
          this.products = []; 
          this.showSearchResults = true;
        }
      }
    });
  }

  goToProduct(productId: string) {
    this.router.navigate(['/client/details', productId]);
    this.clearSearch();
  }

  searchAndShowResults() {
    if (!this.keyword) return;
    this.productService.searchProducts(this.keyword).subscribe((response) => {
      this.router.navigate(['/client/search-results'], { state: { products: response.products || [] } });
      this.isSearchOpen = false;
    });
  }
  
  

  clearSearch() {
    this.keyword = '';
    this.products = [];
    this.showSearchResults = false;
    this.isSearchOpen = false;
  }
}
