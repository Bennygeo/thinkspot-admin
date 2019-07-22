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

  constructor(
    // private _db: AngularFireDatabase,
    private _router: Router,
    private _service: CommonsService
  ) {

  }

  ngOnInit(): void {
    // this._router.navigate(["customer_list"]);
    // this._router.navigate([{ outlets: { homeOutlet: ['customer-list'] } }]);
    this._service.readCustomerList(true);
    this._service.readOrdersList();
  }

}
