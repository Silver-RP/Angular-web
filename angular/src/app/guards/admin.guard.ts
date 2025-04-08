import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    const token = localStorage.getItem('token'); 
    if (!token) {
        this.router.navigate(['/login']);
        return false;
    }

    const decoded: any = jwtDecode(token) 
    if (decoded.role === 'admin') {
        return true;
    } else {
        this.router.navigate(['/not-authorized']);
        return false;
    }
  }
}
