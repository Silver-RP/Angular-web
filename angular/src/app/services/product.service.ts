import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Product {
  _id: string;
  name: string;
  cateName: string;
  salePrice: number;
  price: number;
  images: string[];
}

interface CategoryProducts {
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  fetchProduct(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/detail/${id}`);
  }

  fetchCategoryProducts(cateId: string): Observable<CategoryProducts> {
    return this.http.get<CategoryProducts>(`${this.API_URL}/category-pro/${cateId}`);
  }

  fetchProducts(page: number, sort: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/shop?page=${page}&sort=${sort}`);
  }

  getProductsByCategory(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/category-pro/${categoryId}`);
  }

  searchProducts(keyword: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search?keyword=${keyword}`);
  }

  addToCart(productId: string, token: string, quantity: number): Observable<any> {
    return this.http.post<any>(
      `${this.API_URL}/cart/add`,
      { productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  addProduct(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.API_URL}/admin/add-product`, formData, { headers });
  }

  editProduct(productId: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.API_URL}/admin/edit-product/${productId}`, formData, { headers });
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/product/${productId}`);
  }
}


