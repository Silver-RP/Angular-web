import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private API_URL = 'http://localhost:3000';
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();
  authService: any;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  loadCart(): Observable<any> {
    return this.http.get<{ success: boolean; cart: any[] }>(`${this.API_URL}/cart`, this.getAuthHeaders()).pipe(
      tap((response) => {
        if (response.success) {
          this.cartSubject.next(response.cart || []);
        }
      }),
      catchError((error) => {
        console.error('Error fetching cart:', error);
        this.cartSubject.next([]);
        throw error;
      })
    );
  }

  // addToCart(productId: string, quantity: number): Observable<any> {
  //   return this.http.post(`${this.API_URL}/add-to-cart`, { productId, quantity }, this.getAuthHeaders()).pipe(
  //     tap(() => this.loadCart().subscribe()),
  //     catchError((error) => {
  //       console.error('Error adding to cart:', error);
  //       throw error;
  //     })
  //   );
  // }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.API_URL}/add-to-cart`, { productId, quantity }, this.getAuthHeaders()).pipe(
      tap(() => this.loadCart().subscribe()), // Tải lại giỏ hàng sau khi thêm sản phẩm
      catchError((error) => {
        console.error('Error adding to cart:', error);
        if (error.status === 401) {
          // Token hết hạn, trigger refresh token và retry
          return this.authService.refreshToken().pipe(
            switchMap(newToken => {
              localStorage.setItem('token', newToken as string);
              return this.http.post(`${this.API_URL}/add-to-cart`, { productId, quantity }, this.getAuthHeaders());
            }),
            catchError((refreshError) => {
              console.error('Error refreshing token:', refreshError);
              throw refreshError;
            })
          );
        }
        throw error;
      })
    );
  }
  

  updateCartQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.API_URL}/cart-update`, { productId, quantity }, this.getAuthHeaders()).pipe(
      tap(() => {
        const updatedCart = this.cartSubject.getValue().map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item
        );
        this.cartSubject.next(updatedCart);
      }),
      catchError((error) => {
        console.error('Error updating cart quantity:', error);
        throw error;
      })
    );
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/cart/remove/${productId}`, this.getAuthHeaders()).pipe(
      tap(() => {
        const updatedCart = this.cartSubject.getValue().filter((item) => item.productId._id !== productId);
        this.cartSubject.next(updatedCart);
      }),
      catchError((error) => {
        console.error('Error removing item:', error);
        throw error;
      })
    );
  }
}
