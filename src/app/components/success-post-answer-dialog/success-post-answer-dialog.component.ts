import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-post-answer-dialog',
  templateUrl: './success-post-answer-dialog.component.html',
  styleUrls: ['./success-post-answer-dialog.component.css']
})
export class SuccessPostAnswerDialogComponent implements OnInit {

  constructor(    
    public dialogRef: MatDialogRef<SuccessPostAnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

  ngOnInit(): void {
  }

  nextMovement(){
    this.dialogRef.close();
  }
}

export interface DialogData {
  orderId:string;
}
