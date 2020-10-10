import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoggedGuard } from './logged.guard';
import { Checkout2Component } from './checkout2/checkout2.component';
import { ProductDetailsComponent } from './product-details/product-details.component';


const routes: Routes = [
  {path: 'products', component: ProductsListComponent },
  {path: 'shoppingCart', component: ShoppingCartComponent },
  {path: 'checkout', component: CheckoutComponent, canActivate: [LoggedGuard]},
  {path: 'checkout2', component: Checkout2Component, canActivate: [LoggedGuard]},
  {path: 'products/:id', component: ProductDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
