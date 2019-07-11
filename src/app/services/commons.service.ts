import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FireBase } from '../utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  userList: Object = {};
  onUserListUpdate: EventEmitter<any> = new EventEmitter();
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

  public readCustomerList() {
    this._fb.readUsers().subscribe((val: any) => {
      this.userList = val;
      window.setTimeout((val) => {
        this.onUserListUpdate.emit(val);
      }, 0, val);
      // this.onUserListUpdate.emit(val);
    });
  }
}
