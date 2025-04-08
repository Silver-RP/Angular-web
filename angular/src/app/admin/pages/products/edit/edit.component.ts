import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';


interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  updatedAt: string;
  productCount: number;
}


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
})

export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  categories: Category[] = [];
  product: any;
  oldImages: string[] = [];
  imageUrls: string[] = [];
  newImages: FileList | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editProductForm = this.fb.group({
      name: [''],
      cateId: [''],
      shortDescription: [''],
      description: [''],
      price: [''],
      salePrice: [''],
      SKU: [''],
      quantity: [''],
      featured: ['0'],
      hot: ['0']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.fetchProduct(id).subscribe((data) => {
        this.product = data.product;
        this.oldImages = data.product.images;
        this.imageUrls = this.oldImages.map(img => `http://localhost:3000/app/assets/images/products/${img}`);
        
        this.editProductForm.patchValue({
          ...data.product,
          featured: data.product.featured ? '1' : '0', 
          hot: data.product.hot ? '1' : '0'           
        });
      });
    }
    
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data.categories;
    });
  }
  

  onImageChange(event: any): void {
    
    const files = event.target.files as FileList;
    if (files && files.length > 0) {
      this.newImages = files;
      this.imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    }
  }

  onSubmit(): void {
    if (!this.product) return;
    const formData = new FormData();
    Object.entries(this.editProductForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.oldImages.length > 0) {
      this.oldImages.forEach(image => formData.append('oldImages', image));
    }

    if (this.newImages) {
      Array.from(this.newImages).forEach(file => {
        formData.append('images', file);
      });
      formData.append('deleteOldImages', 'true');
    }

    this.productService.editProduct(this.product._id, formData).subscribe(
      () => {
        alert('Product edited successfully');
        this.router.navigate(['/admin/products']);
      },
      (error) => console.error('Error editing product:', error)
    );
  }
}
