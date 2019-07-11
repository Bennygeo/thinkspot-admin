import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonsService } from 'src/app/services/commons.service';
import { FireBase } from 'src/app/utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {

  private _fb: FireBase;

  constructor(
    private _router: Router,
    private _service: CommonsService,

    private _db: AngularFireDatabase,
  ) {
    this._fb = new FireBase(this._db);
  }

  ngOnInit() {
  }

  clickToHome() {
    //
    this._router.navigate(["customer_list"]);
    this._service.readCustomerList();
    
  }

}
