import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';
import { Subject } from 'rxjs';
import { CommonsService } from 'src/app/services/commons.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  results: Object;
  searchTerm$ = new Subject<string>();


  constructor(
    private _router: Router,
    public dialog: MatDialog,
    private _service: CommonsService
  ) { }

  ngOnInit() {

  }

  assign() {
    console.log("Assign deliveries.");
  }

  view_customers() {
    this._router.navigate(['/book_order/']);
    console.log("View customers.");
  }

  report() {
    console.log("Report.");
    this._router.navigate(["/customer_list/"]);
  }

  add_person() {
    console.log("Add person.");
    // this._router.navigate(["/address"]);
    this._router.navigate([{ outlets: { homeOutlet: ['address'] } }]);
    const dialogRef = this.dialog.open(MatDialogComponent, {
      width: '375px',
      // height:'500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this._router.navigate([{ outlets: { dialogeOutlet: null } }]);
    });
    // this._router.navigate([{ outlets: { home: ['address'] } }]);


  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    // this.homeBtnClick();
  }
}

