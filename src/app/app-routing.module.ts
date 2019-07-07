import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressComponent } from './admin/address/address.component';
import { NoAccessComponent } from './others/no-access/no-access.component';
import { PageNotFoundComponent } from './others/page-not-found/page-not-found.component';
import { CustomerListComponent } from './admin/customer-list/customer-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'address',
    component: AddressComponent,
    outlet: 'homeOutlet'
  },
  {
    // customer-list
    path: 'customer-list',
    component: CustomerListComponent,
    outlet: 'homeOutlet'
  },

  { path: 'no-access', component: NoAccessComponent },
  { path: '**', component: PageNotFoundComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
