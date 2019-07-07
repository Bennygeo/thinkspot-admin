import { Component, OnInit } from '@angular/core';
import { FireBase } from './utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { CommonsService } from './services/commons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'admin';
  private _fb: FireBase;

  constructor(
    private _db: AngularFireDatabase,
    private _router: Router,
    private _service: CommonsService
  ) {
    this._fb = new FireBase(this._db);
  }

  ngOnInit(): void {
    // this._router.navigate(["customer-list"]);
    this._router.navigate([{ outlets: { homeOutlet: ['customer-list'] } }]);
    this._fb.readUsers().subscribe((val: any) => {
      this._service.userList = val;
      this._service.onUserListUpdate.emit(val);
    });
  }

}
