import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/category.service';
import { ProductService } from '../../../../services/product.service';

interface Category {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink]
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      cateId: ['', Validators.required],
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      salePrice: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      SKU: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      featured: ['0', Validators.required],
      hot: ['0', Validators.required],
      images: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService.getCategories()
      .subscribe(
        response => this.categories = response.categories,
        error => console.error('Error fetching categories:', error)
      );
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ images: file });

      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();

    Object.keys(this.productForm.value).forEach(key => {
      formData.append(key, this.productForm.value[key]);
    });

    this.productService.addProduct(formData).subscribe(
      () => {
        alert('Product added successfully');
        this.router.navigate(['/admin/products']);
      },
      error => console.error('Error adding product:', error)
    );
  }
}
