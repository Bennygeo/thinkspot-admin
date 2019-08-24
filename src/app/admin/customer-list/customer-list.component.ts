import { Component, OnInit, NgZone } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DateUtils } from 'src/app/utils/date-utils';
import { Ng2SearchPipe } from 'ng2-search-filter';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  userList: Array<any> = [];
  searchText: string = "";
  //contains the pipe returned data
  searchAry: Array<any> = [];

  checkedCnt: number = 0;
  customers: Array<any> = [];
  //customer status
  active: boolean = false;
  //customer's remaining orders
  remainingDays: number = 0;

  //active customers
  activeCustomers: Array<any> = [];
  //inactive customer
  inActiveCustomers: Array<any> = [];

  checkboxSelectors: Object = {
    all: false,
    active: false,
    inactive: false
  }

  constructor(
    private _service: CommonsService,
    private _router: Router,
    public dialog1: MatDialog,
    private ngZone: NgZone,
    private date_utils: DateUtils,
    private ng2: Ng2SearchPipe
  ) {
    this.ng2 = new Ng2SearchPipe();
    // console.log("customer list class");
  }

  ngOnInit() {
    // console.log("customer list class :: oninit");
    // debugger;
    this._service.onUserListUpdate.subscribe((data) => {
      // console.log("REcieve data");
      // console.log(data);
      let trace = console.log;
      this.userList = [];
      for (let key in data) {
        // debugger;
        data[key].mobile = key;
        data[key].checked = false;

        try {
          data[key].active = "expired/not started";
          //history length
          let len = Object.keys(data[key].history).length;
          //orders length
          let ordersLen = Object.keys(data[key].history[len].dates).length;
          data[key].active = "active";

          let cnt = 0, _len = data[key].history[len].dates;
          for (let date in data[key].history[len].dates) {
            cnt++;
            let __date = this.date_utils.dateFormater(date, "-");
            // trace("date :: " + __date);
            let diff = (Math.round(this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/")))));
            if (diff == 1) break;
          }

          data[key].remainingDays = ordersLen - cnt;
          // trace("rmaining days :: " + (ordersLen - cnt));
          // this.activeCustomers.push({
          //   key: {
          //     remainingDays: ordersLen - cnt
          //   }
          // });
        } catch (e) { }
        this.userList.push(data[key]);
      }
      // debugger;
      // this.ngZone.run(() => this._router.navigate(['customer_list']));
      this.ngZone.run(() => console.log("ng on init."));
    });
  }

  onCustomerClick(evt, index, mobile) {
    // debugger;
    let trace = console.log;
    // trace("-- " + this.userList[index].checked);

    this.userList[index].checked = (this.userList[index].checked) ? false : true;

    this.checkedItemCnt();
    // trace(this.checkedCnt, this.userList.length);
    if (this.checkedCnt == this.userList.length) {
      this.checkboxSelectors['all'] = true;
    } else {
      this.checkboxSelectors['all'] = false;
    }

    if (evt.target.innerText == "View") {
      // console.log("book an order");
      this.bookAnOrder(index, mobile);
    }

    // if (evt.target.innerText == "Break") {
    //   console.log("postponed");
    //   this.postponedAnOrder(index, mobile);
    // }
    return false;
  }

  bookAnOrder(index, mobile) {
    // console.log("bookAnOrder");
    // customer_view
    // this._router.navigate([{ outlets: { dialogeOutlet: null } }]);
    // console.log("index :: " + index);
    this._router.navigate(['/customer_view/' + Date.now(), { mobile: mobile, index: index }]);
  }

  assign() {
    // console.log("Assign deliveries.");
    for (let key in this.userList) {
      // console.log(this.userList[key]);
      if (this.userList[key].checked) console.log(this.userList[key]);
    }
  }

  checkedItemCnt() {
    this.checkedCnt = 0;
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].checked) this.checkedCnt++;
    }
  }

  onAllClick(e) {
    // this.checkedItemCnt();
    this.checkboxSelectors['all'] = e.checked;
    for (let i = 0; i < this.userList.length; i++) {
      this.userList[i].checked = e.checked;
    }

    this.searchAry = this.ng2.transform(this.userList, this.searchText);

    if (e.checked) {
      this.renderSearchList(this.searchAry, true);
    } else {
      this.renderSearchList(this.searchAry, false);
    }

  }

  onActiveClick(e) {
    if (this.checkedCnt != this.userList.length) {
      this.checkboxSelectors['all'] = false;
    }
    if (e.checked) {
      this.searchText = "active";
      this.searchAry = this.ng2.transform(this.userList, this.searchText);
      this.renderSearchList(this.searchAry, true);
    } else {
      this.searchText = "";
      this.searchAry = this.userList;
      this.renderSearchList(this.searchAry, false);
    }
  }

  onAInactiveClick(e) {
    // console.log("in  active");
    if (this.checkedCnt != this.userList.length) {
      this.checkboxSelectors['all'] = false;
    }

    if (e.checked) {
      this.searchText = "expired";
      this.searchAry = this.ng2.transform(this.userList, this.searchText);
      this.renderSearchList(this.searchAry, true);
    } else {
      this.searchText = "";
      this.searchAry = this.userList;
      this.renderSearchList(this.searchAry, false);
    }
  }

  inputTxtChanged(evt) {
    // console.log(evt);
    this.searchText = evt;
    this.searchAry = this.ng2.transform(this.userList, this.searchText);
    // let data = this._service.userList;
    // https://stackblitz.com/edit/angular-search-filter
  }

  renderSearchList(ary, flg) {
    for (let i = 0; i < ary.length; i++) {
      ary[i].checked = flg;
    }
  }

}
