import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials,{
      withCredentials: true
    });
  }

  logoutUser(): Observable<any> {
    return this.http.get(`${this.API_URL}/logout`, {});
  }

  verifyEmailRequest(token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-email/${token}`, {});
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string, passwordConfirmation: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { token, password, password_confirmation: passwordConfirmation });
  }

  refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>(`${this.API_URL}/refresh-token`, {},  { withCredentials: true }).pipe(
      map(response => response.token) 
    );
  }
  
}
