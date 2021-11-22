import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-http-error-dialog',
  templateUrl: './http-error-dialog.component.html',
  styleUrls: ['./http-error-dialog.component.css']
})
export class HttpErrorDialogComponent implements OnInit {

  constructor(    public dialogRef: MatDialogRef<HttpErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  refresh(){
    this.dialogRef.close();
  }
}

export interface DialogData {
  errorMessage:string;
}
