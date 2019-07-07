import { Component, OnInit } from '@angular/core';
import { FireBase } from './utils/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'admin';
  private _fb: FireBase;


  constructor(
    private _db: AngularFireDatabase
  ) {
    this._fb = new FireBase(this._db);
  }



  ngOnInit(): void {
    this._fb.readUsers().subscribe((data) => {
      // debugger;
    });
  }

}
