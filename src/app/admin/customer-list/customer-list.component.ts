import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  userList: Array<any> = [];

  constructor(
    private _service: CommonsService,
    private _changeDet: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._service.onUserListUpdate.subscribe((data) => {
      for (let key in data) {
        data[key].mobile = key;
        this.userList.push(data[key]);
      }
      console.log("list has been updated.")
      // debugger;
      this._changeDet.detectChanges();
    });
  }

  onCustomerClick(index, mobile){
    console.log(index, mobile);
  }

}
