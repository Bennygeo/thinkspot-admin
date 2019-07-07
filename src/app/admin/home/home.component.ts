import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  assign() {
    console.log("Assign deliveries.");
  }

  view_customers() {
    console.log("View customers.");
  }

  report() {
    console.log("Report.");
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

