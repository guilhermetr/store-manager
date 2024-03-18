import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { OrderEditComponent } from './pages/order-edit/order-edit.component';
import { authGuard } from './utils/auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,    
  },
  {
    path: 'register',
    component: RegisterComponent,    
  },
  {
    path: 'products',
    component: ProductEditComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: OrderEditComponent,
    canActivate: [authGuard]
  },
  { 
    path: '', 
    redirectTo: 'products', 
    pathMatch: 'full' 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
