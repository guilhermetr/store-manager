import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditComponent } from './pages/product-edit/product-edit.component';
import { OrderEditComponent } from './pages/order-edit/order-edit.component';

const routes: Routes = [
  {
    path: 'products',
    component: ProductEditComponent
  },
  {
    path: 'orders',
    component: OrderEditComponent
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
