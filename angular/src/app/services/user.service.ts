import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_URL = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    changeUserInfo(data: any): Observable<any> {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
            return throwError(() => new Error('User not authenticated.'));
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });

        return this.http.post(`${this.API_URL}/change-user-info`, data, { headers }).pipe(
            catchError((error) => {
                console.error('Error while changing user info:', error);
                return throwError(() => error);
            })
        );
    }
}
