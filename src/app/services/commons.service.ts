import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {

  userList: Object = {};
  onUserListUpdate: EventEmitter<any> = new EventEmitter();

  constructor(private _snackBar: MatSnackBar) { }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 1000,
    });
  }
}
