import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-error-post-answer-dialog',
  templateUrl: './error-post-answer-dialog.component.html',
  styleUrls: ['./error-post-answer-dialog.component.css']
})
export class ErrorPostAnswerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ErrorPostAnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  tryAgain(){
    this.dialogRef.close("tryAgain");
  }

  nextMovement(){
    this.dialogRef.close("nextMovement");
  }

  reenter(){
    this.dialogRef.close("reenter");
  }

  ngOnInit(): void {

  }

}


export interface DialogData {
  error:string;
  result:string;
}