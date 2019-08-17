import { Component, OnInit, ChangeDetectorRef, HostListener, NgZone, QueryList, ViewChildren } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  userList: Array<any> = [];
  searchText: string = "";

  constructor(
    private _service: CommonsService,
    private _router: Router,
    public dialog1: MatDialog,
    private ngZone: NgZone
  ) {
    // console.log("customer list class");
  }

  ngOnInit() {
    // console.log("customer list class :: oninit");
    // debugger;
    this._service.onUserListUpdate.subscribe((data) => {
      console.log("REcieve data");
      console.log(data);
      this.userList = [];
      for (let key in data) {
        data[key].mobile = key;
        data[key].checked = false;
        this.userList.push(data[key]);
      }
      // this.ngZone.run(() => this._router.navigate(['customer_list']));
      this.ngZone.run(() => console.log("ng on init."));
    });
  }

  onCustomerClick(evt, index, mobile) {
    // debugger;
    let trace = console.log;
    console.log(index, mobile);
    trace("-- " + this.userList[index].checked);

    this.userList[index].checked = (this.userList[index].checked) ? false : true;

    if (evt.target.innerText == "View") {
      console.log("book an order");
      this.bookAnOrder(index, mobile);
    }

    // if (evt.target.innerText == "Break") {
    //   console.log("postponed");
    //   this.postponedAnOrder(index, mobile);
    // }
  }

  bookAnOrder(index, mobile) {
    console.log("bookAnOrder");
    // customer_view
    // this._router.navigate([{ outlets: { dialogeOutlet: null } }]);
    // console.log("index :: " + index);
    this._router.navigate(['/customer_view/' + Date.now(), { mobile: mobile, index: index }]);
  }

  postponedAnOrder(index, mobile) {

  }

  assign() {
    console.log("Assign deliveries.");
  }

  inputTxtChanged(evt) {
    // console.log(evt);
    this.searchText = evt;
    // let data = this._service.userList;
    // https://stackblitz.com/edit/angular-search-filter
  }

  @ViewChildren('checkboxMultiple') private checkboxesMultiple: QueryList<any>;
}
