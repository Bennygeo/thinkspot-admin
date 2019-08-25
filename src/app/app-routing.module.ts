import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressComponent } from './admin/address/address.component';
import { NoAccessComponent } from './others/no-access/no-access.component';
import { PageNotFoundComponent } from './others/page-not-found/page-not-found.component';
import { CustomerListComponent } from './admin/customer-list/customer-list.component';
import { BookOrderComponent } from './admin/book-order/book-order.component';
import { CustomerViewComponent } from './admin/customer-view/customer-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'address',
    component: AddressComponent,
    outlet: 'homeOutlet'
  },
  {
    // customer-list
    path: 'customer_list',
    component: CustomerListComponent,
    // outlet: 'homeOutlet'
  },
  {
    path: 'customer_view/:id',
    pathMatch: 'full',
    component: CustomerViewComponent
  },
  {
    // customer-list
    path: 'book_order',
    component: BookOrderComponent,
    // outlet: 'homeOutlet'
  },
  { path: 'no-access', component: NoAccessComponent },
  { path: '**', component: PageNotFoundComponent },
];



@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
