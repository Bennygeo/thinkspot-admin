import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DateUtils } from 'src/app/utils/date-utils';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  userList: Array<any> = [];
  searchText: string = "";
  //contains the pipe returned data
  searchAry: Array<any> = [];

  todaysDate: any;

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

  orderStatus: string = "";
  assignBtnFlg: boolean = true;

  delivery_boys_list: Array<string> = [];
  selected_delivery_boy: string = "nil";

  readDataObservable: any;
  userListObservable: any;
  userListUpdateObservable: any;

  checkboxSelectors: CustomSelctors = {
    all: false,
    active: false,
    inactive: false
  }

  private firebase: FireBase;

  constructor(
    private _service: CommonsService,
    private _router: Router,
    public dialog1: MatDialog,
    private ngZone: NgZone,
    private date_utils: DateUtils,
    private ng2: Ng2SearchPipe,
    private _db: AngularFireDatabase,
  ) {
    this.firebase = new FireBase(this._db);
    // console.log("customer list class");
  }

  ngOnInit() {
    // console.log("customer list class :: oninit");
    // debugger;
    let trace = console.log;
    //todays time in hours(24 hr format)
    let todayTime = new Date().getHours();
    if (todayTime <= 11) {
      this.todaysDate = new Date();
    } else {
      this.todaysDate = new Date();
      this.todaysDate = this.date_utils.getDateString(this.date_utils.addDays(this.todaysDate, 1), "");
    }

    this.userListObservable = this.firebase.readDeliverBoys().subscribe((data: any) => {
      // debugger;
      let index = -1;
      for (let key in data) {
        index++;
        this.delivery_boys_list.push(data[key]);
      }
      // debugger;
      // this.delivery_boys_list = ;
      // this._service.deliveryBoysList = this.delivery_boys_list;
    });

    this.userListUpdateObservable = this._service.onUserListUpdate.subscribe((data) => {
      // console.log("REcieve data");
      // console.log(data);

      this.userList = [];
      for (let key in data) {
        // debugger;
        data[key].mobile = key;
        data[key].checked = false;

        try {
          data[key].active = "expired/others";
          this.orderStatus = "in-active";
          data[key].remainingDays = 0;
          //history length
          let len = Object.keys(data[key].history).length;
          //orders length
          let ordersLen = Object.keys(data[key].history[len].dates).length + 1;
          data[key].active = "active";
          this.orderStatus = "active";


          let cnt = 0, _len = data[key].history[len].dates, postponedCnt = 0, todayIndex = 0;
          for (let date in data[key].history[len].dates) {
            cnt++;
            let __date = this.date_utils.dateFormater(date, "-");
            // trace("postponed : " + data[key].history[len].dates[date].index);
            let diff = (Math.round(this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/")))));
            // trace("diff :: " + diff);
            if (data[key].history[len].dates[date].index == "postponed") {
              postponedCnt++;
            }
            if (diff == 0) todayIndex = cnt;
          }
          // trace("cnrt :: " + cnt);
          // trace("ordersLen :: " + ordersLen);

          data[key].remainingDays = (ordersLen - todayIndex - postponedCnt);
          // trace("data[key].remainingDays :: " + data[key].remainingDays);
          // (Math.sign(this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date, "/")))) == -1 || todayTime <= 11) ? false : true,
          // this.activeCustomers.push({
          //   key: {
          //     remainingDays: ordersLen - cnt
          //   }
          // });
        } catch (e) { }
        this.userList.push(data[key]);
      }
      this.searchAry = this.userList;
      // debugger;
      // this.ngZone.run(() => this._router.navigate(['customer_list']));
      this.ngZone.run(() => console.log("ng on init."));
    });
  }

  onCustomerClick(evt, index, mobile) {
    // debugger;
    let trace = console.log;
    // trace("-- " + this.userList[index].checked);
    // trace("index :: " + index);

    // this.userList[index].checked = (this.userList[index].checked) ? false : true;
    this.searchAry[index].checked = (this.searchAry[index].checked) ? false : true;

    if (this.searchAry[index].checked) this.assignBtnFlg = false;

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
    console.log("Assign deliveries.");
    this.assignBtnFlg = true;
    let modifiedData = [];
    this.readDataObservable = this.firebase.readDailyOrders(this.todaysDate).subscribe((data) => {

      try {
        this.readDataObservable.unsubscribe();
      } catch (e) {
        this.assignBtnFlg = false;
        // console.log(data);
        for (let key in this.searchAry) {
          // console.log("key : " + key);
          // console.log("checked : " + this.searchAry[key].checked);
          if (this.searchAry[key].active == "active" && this.searchAry[key].checked) {
            let tmp = JSON.parse(data[this.searchAry[key].mobile].tender);
            tmp.assigned_to = this.selected_delivery_boy;
            modifiedData[this.searchAry[key].mobile] = tmp;
            console.log("assign");
            //write orders
            this.firebase.writeDailyOrders(this.searchAry[key].mobile, this.todaysDate, JSON.stringify(tmp));
            // console.log();
            //write user history orders
            this.firebase.update_user_info(this.searchAry[key].mobile, this.todaysDate, 1, this.selected_delivery_boy);
            this.assignBtnFlg = true;
          }
        }
      }
    }, (err) => {
      console.log("customer list :: read error.");
    });
  }

  checkedItemCnt() {
    this.checkedCnt = 0;
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].checked) this.checkedCnt++;
    }
  }

  onAllClick(e) {
    // this.activeFlg = false;
    // this.inActiveFlg = false;
    // this.checkedItemCnt();
    this.checkboxSelectors['all'] = e.checked;
    for (let i = 0; i < this.userList.length; i++) {
      this.userList[i].checked = e.checked;
    }

    // this.searchAry = this.userList;
    if (e.checked) {
      this.renderSearchList(this.searchAry, true);
    } else {
      this.renderSearchList(this.searchAry, false);
    }
  }

  onActiveClick(e) {
    this.checkboxSelectors['active'] = true;
    this.checkboxSelectors['inactive'] = false;

    if (this.checkedCnt != this.userList.length) {
      this.checkboxSelectors['all'] = false;
    }
    if (e.checked) {
      this.searchText = "active";
      this.searchAry = this.ng2.transform(this.userList, this.searchText);
      // this.renderSearchList(this.searchAry, true);
    } else {
      this.searchText = "";
      this.searchAry = this.userList;
      // this.renderSearchList(this.searchAry, false);
    }
  }

  onAInactiveClick(e) {
    // console.log("in  active");
    this.checkboxSelectors['active'] = false;
    this.checkboxSelectors['inactive'] = true;

    if (this.checkedCnt != this.userList.length) {
      this.checkboxSelectors['all'] = false;
    }

    if (e.checked) {
      this.searchText = "expired";
      this.searchAry = this.ng2.transform(this.userList, this.searchText);
      // this.renderSearchList(this.searchAry, true);
    } else {
      this.searchText = "";
      this.searchAry = this.userList;
      // this.renderSearchList(this.searchAry, false);
    }
  }

  inputTxtChanged(evt) {
    // console.log(evt);
    this.searchText = evt;
    this.searchAry = this.ng2.transform(this.userList, this.searchText);
    this.renderSearchList(this.searchAry, false);
    // let data = this._service.userList;
    // https://stackblitz.com/edit/angular-search-filter

    this.checkboxSelectors['active'] = false;
    this.checkboxSelectors['all'] = false;
    this.checkboxSelectors['inactive'] = false;
  }

  renderSearchList(ary, flg) {
    if (ary.length != 0) {
      for (let i = 0; i < ary.length; i++) {
        ary[i].checked = flg;
      }
    }

    if (flg) {
      this.assignBtnFlg = false;
    } else {
      this.assignBtnFlg = true;
    }
  }

  onDeliveryBoyChange(evt): void {
    console.log(evt.value);
    this.selected_delivery_boy = evt.value;
  }

  ngOnDestroy(): void {
    console.log("ng destroy");
    this.userListObservable.unsubscribe();
    this.userListUpdateObservable.unsubscribe();
    try {
      this.readDataObservable.unsubscribe();
    } catch (e) {

    }
    // throw new Error("Method not implemented.");
  }
}


interface CustomSelctors {
  all: boolean,
  active: boolean,
  inactive: boolean
}

