import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, NgZone, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonsService } from 'src/app/services/commons.service';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Utils } from 'src/app/utils/utils';
import { DateUtils } from 'src/app/utils/date-utils';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})

export class CustomerViewComponent implements OnInit {

  private _fb: FireBase;

  /*
  * Tender types
  */
  types: Array<string> = ["Medium", "Large"];
  type: string;

  /*
 * discount price
 */
  discount: number = 5;

  priceWithoutDiscount: number = 0;


  /*
  * Straw price and flags
  */
  strawPrice: number = 2;
  strawFlag: boolean = false;

  /*
  * Subscription flags
  */
  subsFlag: boolean = false;

  /*
  * Straw price and flags
  */
  changeDetecter: boolean = false;

  totalPrice: number = 0;
  originalPrice: number = 0;
  offerPrice: number = 0;

  addToCartBtnDisabled: boolean = false;

  /*
  * Nut type
  */
  nutType: string = "Large";
  nutTypes: Array<NuType> = [
    { value: "Large", viewValue: 1, price: 45, minCount: 2 },
    { value: "Medium", viewValue: 2, price: 31.5, minCount: 3 },
  ];

  nutVarieties: Array<string> = ["Water", "Hard", "Orange"];
  selectedNutVariety: string;
  /*
* delivery charges
*/
  deliveryCharges: number = 10;
  selectedNutType: string = this.nutTypes[0]["value"];
  price: number = this.nutTypes[0]["price"];
  minCount: number = this.nutTypes[0]["minCount"];
  /*
  * total number of units per day
  */
  unitsPerDay: number = this.nutTypes[0]["minCount"];
  editedUnitsPerDay: number = this.nutTypes[0]["minCount"];
  /*
  * Subscribed days
  */
  subscribedDays = 1;

  tenderDetails: Object;

  weekdays: Array<string>;
  selectedDays: Object;
  packageOptions: Object;
  priceOption: number;

  subscribeActiveFlgs: Object;
  subscribe_type: string = "std";
  subscribeVisibilityFlg: boolean = false;
  diff: number = 0;

  start_date: Date;
  end_date: Date;
  firebase: FireBase;

  //orders;
  orders: Array<any>;
  historyObj: Object = {};
  msg: string;
  btnsView: boolean = false;
  ordersExist: boolean = true;

  mobile: any;
  selectedDateItem: any;
  editEnabled: boolean = false;
  noOfReplacements: number = 0;

  constructor(
    private _router: Router,
    private _service: CommonsService,

    private _db: AngularFireDatabase,

    private _utils: Utils,
    private date_utils: DateUtils,
    private db: AngularFireDatabase,
    private _activatedRoute: ActivatedRoute,
    private _changeDet: ChangeDetectorRef,
  ) {
    this._fb = new FireBase(this._db);
    this.type = this.types[0];

    this.weekdays = this._utils.weekdays.slice(this._utils.todayNo + 1, 7).concat(this._utils.weekdays.slice(0, this._utils.todayNo + 1));
    this.selectedDays = {
      "1": 1, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0
    }

    this.subscribeActiveFlgs = {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    }
    this.selectedNutVariety = this.nutVarieties[0];
    this.date_utils = new DateUtils();
    this.start_date = new Date();
    this.firebase = new FireBase(this.db);

    this.orders = [];
  }

  ngOnInit() {

    this.packageOptions = {
      "pack7": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "3andmore": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "std": this.price + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
    }

    /*
    * write the initial pack
    */
    this.priceOption = this.packageOptions["std"];
    this.renderChanges();

    this._activatedRoute.paramMap.subscribe(params => {
      this.mobile = params.get('mobile');
      // console.log("mobile :: " + this.mobile);

      this.firebase.readOrders(this.mobile).subscribe((data: any) => {

        if (!data) {
          this.msg = "No active ordres.";
          this.ordersExist = false;
          return;
        };

        this.ordersExist = true;
        this._service.historyLength = Object.keys(data).length;
        let _data = data[this._service.historyLength];

        this.historyObj = _data;
        let cnt = -1;
        for (var key in _data["dates"]) {
          cnt++;
          var __date = this.date_utils.dateFormater(key, "-");
          // console.log("key :: " + this.date_utils.stdDateFormater(__date));
          // console.log("diff : " + );
          this.orders[cnt] = {
            index: _data["dates"][key].index,
            date: this.date_utils.dateFormater(key, "-"),
            count: _data["dates"][key].count,
            expired: (Math.sign(this.date_utils.dateDiff(new Date(), new Date(this.date_utils.stdDateFormater(__date)))) == -1) ? false : true
          };
        }

        // debugger;
        this.orders.sort(function (a, b) {
          return a.index - b.index
        });

        this._changeDet.detectChanges();
      });

    });
  }

  @Input() data: any = {
    p_name: "Tender"
  };
  @Output() stockValueChange = new EventEmitter();

  plusMinusValue(val) {
    // console.log("tender plus minus called : " + val);
    this.unitsPerDay = val;
    this.renderChanges();
  }

  daysClickAction(e) {
    // debugger;
    this.setSubscribeSetActiveButton(null);
    let targetDay = e.target.id.slice(-1) * 1;
    this.selectedDays[(targetDay + 1)] = (this.selectedDays[(targetDay + 1)]) ? 0 : 1;
    this.changeDetecter = true;
    this.renderChanges();
  }

  onStrawChange() {
    // console.log(this.strawFlag);
    this.renderChanges();
  }

  public renderChanges() {
    this.packageOptions = {
      "pack7": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "3andmore": this.price - this.discount + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
      "std": this.price + this.deliveryCharges + ((this.strawFlag) ? 2 : 0),
    }

    let totalDays: number = 0;
    let alternateCnt_A = 0, alternateCnt_B = 0, thrice_a_week_cnt = 0;
    for (var key in this.selectedDays) {
      if (this.selectedDays[key]) {
        totalDays++;
        let b = Number(key);
        if ((b % 2) != 0) {
          alternateCnt_A++;
        } else {
          alternateCnt_B++;
        }
        if ((b % 3) == 1) thrice_a_week_cnt++;
      }
    }
    this.subscribedDays = totalDays;

    if (!this.subsFlag) totalDays = 1;

    if (alternateCnt_A == 4 && totalDays == 4) this.setSubscribeSetActiveButton(1);
    if (alternateCnt_B == 3 && totalDays == 3) this.setSubscribeSetActiveButton(1);
    if (thrice_a_week_cnt == 3 && totalDays == 3) this.setSubscribeSetActiveButton(2);

    if (totalDays == 7) this.subscribe_type = "7 days pack";

    if (totalDays == 7 || this.unitsPerDay > this.unitsPerDay - 1) {
      this.priceOption = this.packageOptions["pack7"];
    } else {
      this.priceOption = this.packageOptions["std"];
    }

    // if (this.strawFlag) this.priceOption += 2;
    //if total days is 7 set 7 days button as active
    if (totalDays == 7) this.setSubscribeSetActiveButton(0);

    if (this.subsFlag) {
      this.totalPrice = this.priceOption * this.subscribedDays * this.unitsPerDay;
      this.originalPrice = (this.packageOptions['std'] * this.unitsPerDay * this.subscribedDays);
      this.diff = Math.abs((this.priceOption * this.subscribedDays *
        this.unitsPerDay) - (this.packageOptions['std'] * this.unitsPerDay * this.subscribedDays));

    } else {
      this.subscribedDays = 1;
      this.totalPrice = this.priceOption * this.unitsPerDay;

      this.originalPrice = (this.packageOptions['std'] * this.unitsPerDay);

      this.diff = Math.abs((this.priceOption *
        this.unitsPerDay) - (this.packageOptions['std'] * this.unitsPerDay));
    }

    // console.log("subscribed days :: " + this.subscribedDays);
    this.end_date = this.date_utils.addDays(new Date(), this.subscribedDays);

    this.tenderDetails = {
      "category": "Vegetables",
      "name": this.data["p_name"],
      "img": "assets/products/veg/tender.jpg",
      "id": "product_1",
      "price": this.originalPrice,
      "type": this.selectedNutType,
      "quantity": (this.unitsPerDay * this.subscribedDays),
      "totalPrice": this.totalPrice,
      "per_day": this.unitsPerDay,
      "total": (this.unitsPerDay * this.subscribedDays),
      "no_of_days": this.subscribedDays,
      "sub_type": this.subscribe_type,
      "subscribe": this.subsFlag,
      "offers": this.diff,
      "delivery_charge": this.deliveryCharges * (this.unitsPerDay * this.subscribedDays),
      "straw": this.strawFlag,
      "strawPrice": (this.strawFlag) ? (this.strawPrice * this.unitsPerDay) : 0,
      "units": 1,
      "delivery_status": "Not delivered",
      "start_date": this.date_utils.getDateString(this.start_date, ""),
      "end_date": this.date_utils.getDateString(this.end_date, ""),
      "paid": "No",
      "nut_type": "sweet",
    }
  }

  private onNutVarietyChange(e) {
    console.log(e.value);
  }

  public onNutTypeChange(e) {
    this.price = this.nutTypes[e.value - 1]["price"];
    this.selectedNutType = this.nutTypes[e.value - 1]["value"];
    this.minCount = this.nutTypes[e.value - 1]["minCount"];
    this.unitsPerDay = this.minCount;
    // Utils.trace("min  :: " + this.minCount);
    this.renderChanges();
    // this.ref.detectChanges();
  }

  subscribeBtn() {
    // console.log("subscribe");
    this.subscribeVisibilityFlg = true;
  }

  sevenDaysClick() {
    this.subscribe_type = "Seven days pack";
    this.setSubscribeSetActiveButton(0);
    for (let key in this.selectedDays) this.selectedDays[key] = 1;
    this.changeDetecter = true;
    this.renderChanges();
  }

  alternateDaysClick() {
    this.subscribe_type = "Alternate days pack";
    this.setSubscribeSetActiveButton(1);
    for (let key in this.selectedDays) {
      let b = Number(key);
      if ((b % 2) == 0)
        this.selectedDays[key] = 0;
      else
        this.selectedDays[key] = 1;
    }
    this.changeDetecter = true;
    this.renderChanges();
  }

  every3DaysClick() {
    this.subscribe_type = "Thrice a week pack";
    this.setSubscribeSetActiveButton(2);
    for (let key in this.selectedDays) {
      let b = Number(key);
      if ((b % 3) == 1)
        this.selectedDays[key] = 1;
      else
        this.selectedDays[key] = 0;
    }
    this.changeDetecter = true;
    this.renderChanges();
  }

  setSubscribeSetActiveButton(index) {
    //reset flags
    for (let key in this.subscribeActiveFlgs) this.subscribeActiveFlgs[key] = 0;
    //active button
    this.subscribeActiveFlgs[index] = 1;
  }

  onResetClick() {
    for (let key in this.subscribeActiveFlgs) this.subscribeActiveFlgs[key] = 0;
    for (let key in this.selectedDays) this.selectedDays[key] = 0;
    this.selectedDays[1] = 1;
    this.renderChanges();
    this.changeDetecter = false;
  }

  onSubscribeChange() {
    this.addToCartBtnDisabled = this.subsFlag;
    this.renderChanges();
  }

  addToCart() {
    // debugger;
    for (let i = 0; i < this.subscribedDays; i++) {
      let _date = this.date_utils.addDays(new Date(), i);
      // console.log(i + " : date : " + this.date_utils.getDateString(_date, ""));
    }
  }

  addToSubscriptionBag() {
    let index = 0;

    this.historyObj = {
      // "start_date": this.date_utils.getDateString(this.start_date, "-"),
      // "end_date": this.date_utils.getDateString(this.end_date, "-"),
      "totalPrice": this.totalPrice,
      "per_day": this.unitsPerDay,
      "straw": this.strawFlag,
      "offers": this.diff,
      "no_of_days": this.subscribedDays,
      "active": "yes",
      "price": this.originalPrice,
      "paused": false,
      "dates": {

      }
    }

    for (var key in this.selectedDays) {
      index++;
      if (this.selectedDays[key] == 1) {
        // console.log("Key :: " + key);
        let _date = this.date_utils.addDays(new Date(), key);
        // console.log("date :: " + _date);
        this.firebase.write_tc_orders(this.date_utils.getDateString(_date, ""), "9486140936", this.tenderDetails);

        this.historyObj['dates'][this.date_utils.getDateString(_date, "")] = {
          index: index,
          'delivered': false,
          'missed': false,
          'replacement': 0,
          'assigned_to': 'nil',
          'delivered_by': 'nil',
          'count': this.unitsPerDay
        }
      }
    }
    // let start = this.date_utils.stdDateFormater(this.historyObj['start_date']);
    this.firebase.user_history("9486140936", this.historyObj, "yes", this._service.historyLength + 1);
  }


  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {

  }
  closeOutsideSidenav() {
    console.log("closeOutsideSidenav");
  }

  onUserDatesClick(evt, data) {
    // console.log(data);    
    this.selectedDateItem = data;
    let date = this.date_utils.dateFormater(data.date, "");
    // console.log("date :: " + data.date);
    // console.log("____________________________________");

    this.editEnabled = false;

    if (!this.historyObj['dates'][date]["delivered"]) {
      this.btnsView = true;
    } else {
      this.btnsView = false;
    }

    this._changeDet.detectChanges();
    return false;
  }

  clickToHome() {
    this._router.navigate(["customer_list"]);
    this._service.readCustomerList(false);
  }

  editAction() {
    console.log("Edit");
    this.editEnabled = true;
    this.btnsView = false;
  }

  postponeAction() {
    console.log("Postpone");
  }

  deleteAction() {
    console.log("Delete");
  }

  pauseAction() {
    console.log("Pause");
  }

  stopAction() {
    console.log("Stop");
  }

  orderCountUpdate(val) {
    this.editedUnitsPerDay = val;
  }

  editUpdateAction() {
    // console.log("editUpdateAction");
    // console.log(this.selectedDateItem);
    let date = this.date_utils.dateFormater(this.selectedDateItem.date, "");
    // this.historyObj['dates'][date]['replacement'] = this.noOfReplacements;
    // this.historyObj['dates'][date]['count'] = this.editedUnitsPerDay;

    // console.log(this.historyObj['dates'][date]);
    this.firebase.editupdateWrite("9486140936", this._service.historyLength, { count: this.editedUnitsPerDay, replacement: this.noOfReplacements }, date);
    // console.log("update : " + this.editedUnitsPerDay + "  -- :: " + this.noOfReplacements);
    // debugger;
  }

  editCancelAction() {
    console.log("editCancelAction");
    this.editEnabled = false;
    this.btnsView = true;

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

export interface NuType {
  value: string;
  viewValue: number;
  price: number;
  minCount: number;
}