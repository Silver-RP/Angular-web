import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductComponent } from './pages/products/products.component';
import { CategoryComponent } from './pages/categories/categories.component';
import { AddCategoryComponent } from './pages/categories/add/add.component';
import { EditCategoryComponent } from './pages/categories/edit/edit.component';
import { AddProductComponent } from './pages/products/add/add.component';
import { EditProductComponent } from './pages/products/edit/edit.component';

import { AuthInterceptor } from '../services/auth.interceptor'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminGuard } from '../guards/admin.guard'; 

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: '', component: DashboardComponent }, 
      { path: 'products', component: ProductComponent },
      { path: 'products/add', component: AddProductComponent },
      { path: 'products/edit/:id', component: EditProductComponent },

      { path: 'categories',component: CategoryComponent },
      { path: 'categories/add',component: AddCategoryComponent },
      { path: 'categories/edit/:id',component: EditCategoryComponent },

     




     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AdminGuard
  ],
})
export class AdminRoutingModule { }
