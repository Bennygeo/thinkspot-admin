import { Component, OnInit, OnDestroy } from '@angular/core';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  fb: FireBase;
  deliveryBoysObservale: any;
  credentialOwner: string = "";
  pswdFlg: boolean = false;
  loginData: any;

  constructor(
    private _db: AngularFireDatabase
  ) {
    this.fb = new FireBase(this._db);
  }

  ngOnInit() {
    this.deliveryBoysObservale = this.fb.readLoginDetails().subscribe((data) => {
      this.loginData = data;
    });
  }

  onLoginAction(user, pswd) {
    console.log(pswd.value);
    if (this.loginData[user.value]) {
      this.credentialOwner = this.loginData[user.value];
      this.pswdFlg = true;
    } else {
      this.credentialOwner = "Invalid user."
      this.pswdFlg = false;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.deliveryBoysObservale.unsubscribe();
    // throw new Error("Method not implemented.");
  }

}
