import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddressComponent } from './admin/address/address.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { FirebaseModule, FirebaseProvider } from 'angular-firebase'

import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatOptionModule, MatSelectModule, MatButtonModule, MatInputModule, MatRadioModule, MatDialogModule, MatSnackBarModule, MatCheckboxModule, MatIconModule } from '@angular/material';
import { NoAccessComponent } from './others/no-access/no-access.component';
import { PageNotFoundComponent } from './others/page-not-found/page-not-found.component';
import { HomeComponent } from './admin/home/home.component';
import { MatDialogComponent } from './admin/mat-dialog/mat-dialog.component';
import { CustomerListComponent } from './admin/customer-list/customer-list.component';
import { BookOrderComponent } from './admin/book-order/book-order.component';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { CustomerViewComponent } from './admin/customer-view/customer-view.component';
import { PlusMinusComponent } from './utils/plus-minus/plus-minus.component';
import { Utils } from './utils/utils';
import { DateUtils } from './utils/date-utils';

@NgModule({
  declarations: [
    AppComponent,
    AddressComponent,
    NoAccessComponent,
    PageNotFoundComponent,
    HomeComponent,
    MatDialogComponent,
    CustomerListComponent,
    BookOrderComponent,
    CustomerViewComponent,
    PlusMinusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule, MatOptionModule, MatSelectModule, MatButtonModule, MatInputModule, MatRadioModule, MatDialogModule, MatSnackBarModule, MatCheckboxModule, MatIconModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firbase, 'angular-auth-firebase'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    MatDialogComponent,
  ],
  providers: [
    Utils,
    DateUtils,
    // AuthService,
    AngularFireDatabase,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
