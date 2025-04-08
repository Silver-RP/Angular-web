import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard'; 
import { NotAuthorizedComponent } from './admin/pages/notAuthorizedComponent/NotAuthorizedComponent.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full',
  },
  {
    path: 'client',
    loadChildren: () => import('./client/client-routing.module').then(m => m.ClientRoutingModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),  canActivate: [AdminGuard] 
  },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', redirectTo: 'client' }
];
