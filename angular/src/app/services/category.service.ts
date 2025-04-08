import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  updatedAt: string;
  productCount: number;
}

interface CategoryProducts {
  products: Category[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  static fetchAllCategories() {
    throw new Error('Method not implemented.');
  }
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<{ categories: Category[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<{ categories: Category[] }>(`${this.API_URL}/admin/categories`, { headers });
  }

  fetchCategories(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/detail/${id}`);
  }

  fetchCategoryProducts(cateId: string): Observable<CategoryProducts> {
    return this.http.get<CategoryProducts>(`${this.API_URL}/category-pro/${cateId}`);
  }

  addCategory(category: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.API_URL}/admin/add-category`, category, { headers });
  }

  getCategoryById(categoryId: string): Observable<any> {
    const token = localStorage.getItem("token");
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.API_URL}/admin/category/${categoryId}`, { headers });
  }

  editCategory(categoryId: string, category: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.API_URL}/admin/edit-category/${categoryId}`, category, { headers });
  }

  deleteCategory(categoryId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.API_URL}/admin/category/${categoryId}`, { headers });
  }

}
