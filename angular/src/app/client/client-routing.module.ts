import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from '../client/pages/home/home.component'; 
import { DetailsComponent } from '../client/pages/details/details.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { MyAccountDetailsComponent } from './pages/account-details/account-details.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CategoryProductComponent } from './components/shop/category-product/category-product.component';
import { SearchResultsComponent } from './components/common/search-results/search-results.component';
import { CartComponent } from './pages/cart/cart.component';

import { AuthInterceptor } from '../services/auth.interceptor'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: '', component: HomeComponent }, 
      { path: 'details/:id', component: DetailsComponent },

      { path: 'register', component: RegisterComponent},
      { path: 'login', component: LoginComponent},
      { path: 'my-account', component: MyAccountComponent },
      { path: 'verify-email/:token', component: VerifyEmailComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password/:token', component: ResetPasswordComponent },
      { path: 'account-details', component: MyAccountDetailsComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'category-pro/:id', component: CategoryProductComponent },
      { path: 'search-results', component: SearchResultsComponent },
      { path: 'cart', component: CartComponent },

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
    }
  ],
})
export class ClientRoutingModule { }
