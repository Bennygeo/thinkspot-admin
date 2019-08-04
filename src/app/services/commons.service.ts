import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FireBase } from '../utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  userList: Object = {};
  orders: Object = {};
  onUserListUpdate: EventEmitter<any> = new EventEmitter();
  userOrdersUpdate: EventEmitter<any> = new EventEmitter();
  historyLength: number =0;

  private _fb: FireBase;

  constructor(
    private _snackBar: MatSnackBar,
    private _db: AngularFireDatabase,
  ) {
    this._fb = new FireBase(this._db);
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }

  public readCustomerList(flg) {
    //if flg is false and length is 0 read from firebase 
    //else return the local object
    // debugger;
    if (!flg && Object.keys(this.userList).length != 0) {
      window.setTimeout((val) => {
        this.onUserListUpdate.emit(val);
      }, 0, this.userList);
    } else {
      this._fb.readUsers().subscribe((val: any) => {
        this.userList = val;
        window.setTimeout((val) => {
          this.onUserListUpdate.emit(val);
        }, 0, val);
        // this.onUserListUpdate.emit(val);
      });
    }
  }

  public readOrdersList() {
    this._fb.readOrders("9486140936").subscribe((val: any) => {
      // debugger;
      this.orders = val;
      window.setTimeout((val) => {
        this.userOrdersUpdate.emit(val);
      }, 0, val);
    });
  }
}
