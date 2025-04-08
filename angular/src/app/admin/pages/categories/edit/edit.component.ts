import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  categoryId!: string;
  previewImage: string | null = null;
  imageFile: File | null = null;
  existingImage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      image: [null] 
    });

    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe(response => {
        if (response.success && response.category) {
          this.categoryForm.patchValue({
            name: response.category.name,
            slug: response.category.slug
          });
          this.existingImage = response.category.image;
        }
      }, error => {
        console.error('Error fetching category:', error);
      });
    }
  }

  handleImageChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.imageFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.imageFile);
      this.categoryForm.get('image')?.setValue(this.imageFile);
    }
  }

  handleSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.categoryForm.get('name')?.value);
    formData.append('slug', this.categoryForm.get('slug')?.value);
    formData.append('categoryId', this.categoryId);
    
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.categoryService.editCategory(this.categoryId, formData).subscribe(response => {
      if (response.success) {
        alert('Category edited successfully.');
        this.router.navigate(['/admin/categories']);
      } else {
        alert(response.message);
      }
    }, error => {
      console.error('Error editing category:', error);
      const errorMessage = error.error?.message || "An error occurred while adding the category.";
        alert(errorMessage);
    });
  }
}
