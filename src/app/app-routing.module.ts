import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressComponent } from './admin/address/address.component';
import { NoAccessComponent } from './others/no-access/no-access.component';
import { PageNotFoundComponent } from './others/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'address',
    component: AddressComponent,
    outlet: 'dialogeOutlet'
  },
  { path: 'no-access', component: NoAccessComponent },
  { path: '**', component: PageNotFoundComponent }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
