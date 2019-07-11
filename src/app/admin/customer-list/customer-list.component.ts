import { Component, OnInit, ChangeDetectorRef, HostListener, NgZone } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  userList: Array<any> = [];

  constructor(
    private _service: CommonsService,
    private _changeDet: ChangeDetectorRef,
    private _router: Router,
    public dialog1: MatDialog,
    private ngZone: NgZone
  ) {
    console.log("customer list class");
  }

  ngOnInit() {
    console.log("customer list class :: oninit");
    // debugger;
    this._service.onUserListUpdate.subscribe((data) => {
      console.log("REcieve data");
      console.log(data);
      for (let key in data) {
        data[key].mobile = key;
        this.userList.push(data[key]);
      }
      this.ngZone.run(() => this._router.navigate(['customer_list']));
      // this._changeDet.detectChanges();
    });
    // this._changeDet.detectChanges();
  }

  onCustomerClick(evt, index, mobile) {
    // debugger;
    // console.log(index, mobile);
    if (evt.target.innerText == "Book") {
      console.log("book an order");
      this.bookAnOrder(index, mobile);
    }

    if (evt.target.innerText == "Break") {
      console.log("postponed");
      this.postponedAnOrder(index, mobile);
    }
  }

  bookAnOrder(index, mobile) {
    // customer_view
    // this._router.navigate([{ outlets: { dialogeOutlet: null } }]);
    // console.log("index :: " + index);
    this._router.navigate(['/customer_view/' + index]);
  }

  postponedAnOrder(index, mobile) {

  }
}
