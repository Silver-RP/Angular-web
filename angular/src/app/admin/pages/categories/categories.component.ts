import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/category.service'

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  updatedAt: string;
  productCount: number;  
}

@Component({
  selector: 'app-category',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];

  constructor( private categoryService: CategoryService ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response.categories;
      },
      (error) => console.error('Error fetching categories:', error)
    );
  }
  

  handleDeleteCategory(id: string): void {
    const isConfirmed = confirm('Are you sure you want to delete this category?');
    if (!isConfirmed) return;
  
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        alert('Category deleted successfully!');
        this.categories = this.categories?.filter(category => category._id !== id) || [];
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        const errorMessage = error?.error?.message || 'An error occurred while deleting the category.';
        alert(errorMessage);
      }
    });
    
  }
}  