import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AddCategoryComponent {
  previewImage: string | null = null;
  imageFile: File | null = null;
  categoryForm: FormGroup;

  constructor( private router: Router, private categoriesService: CategoryService) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      slug: new FormControl('', [Validators.required]),
      image: new FormControl(null, [Validators.required])
    });
  }

  handleImageChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.imageFile = file;
      this.previewImage = URL.createObjectURL(file);
      this.categoryForm.patchValue({
        image: file
      });
    }
  }

  handleSubmit(): void {
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.invalid) {
      return; 
    }
    if (this.categoryForm.invalid) {
      alert("Category name, slug, and image are required");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", this.categoryForm.get("name")?.value);
    formData.append("slug", this.categoryForm.get("slug")?.value);
    formData.append("image", this.categoryForm.get("image")?.value);
  
    this.categoriesService.addCategory(formData).subscribe(
      (response: any) => {
        if (response.success) {
          alert("Category added successfully.");
          this.router.navigate(['/admin/categories']);
        } else {
          alert(response.message);
        }
      },
      error => {
        console.error("Error adding category:", error);
        const errorMessage = error.error?.message || "An error occurred while adding the category.";
        alert(errorMessage);
      }
    );
  }
  
}
