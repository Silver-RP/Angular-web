import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../../../services/home.service';

interface Category {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-shop-sidebar',
  standalone: true,
  templateUrl: './shop-sidebar.component.html',
  styleUrls: ['./shop-sidebar.component.css'],
  imports: [CommonModule, RouterModule]
})
export class ShopSidebarComponent implements OnInit {
  categories: Category[] = [];
  error: string | null = null;
  loading: boolean = true;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.homeService.getHomeProducts().subscribe({
      next: (data) => {
        if (data?.categories && Array.isArray(data.categories)) {
          this.categories = data.categories;
        } else {
          this.error = 'No categories found';
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.error = 'Failed to fetch categories';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
