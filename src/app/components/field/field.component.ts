import { Component, OnInit, Input, Output } from '@angular/core';


import { FormGroup } from '@angular/forms';
import { FieldResource } from 'src/app/models/FieldResource';

//THIS COMPONENT HANDLES THE DISPLAY AND INPUT ENTRY FOR EACH FIELD
@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit  {

  ngOnInit(): void {

  }
  
  @Input() field:FieldResource;
  @Input() fieldForm: FormGroup;


  errorMessage:string;
  meridian = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }

  get isValid() { return this.fieldForm.valid; }

  //only allow int --> not used
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}