import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

const API_URL = 'http://localhost:3000';

interface Category {
  _id: string;
  name: string;
  image: string;
}

@Injectable({
  providedIn: 'root' // 👈 Giúp Service có thể dùng ở bất kỳ đâu
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getHomeProducts(): Observable<{
    productsHot: never[]; 
    categories: Category[];
    productsFeatured: never[]
}> {
    return this.http.get<{ productsHot: never[], categories: Category[], productsFeatured: never[] }>(API_URL).pipe(
      catchError((error) => {
        console.error("Error fetching home products:", error);
        return throwError(() => new Error("Failed to fetch home products"));
      })
    );
  }
}
