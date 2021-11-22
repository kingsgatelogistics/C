import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldResource } from '../models/FieldResource';

@Injectable({
  providedIn: 'root'
})

//THIS SERVICE IS USED TO PARSE QUESTION FIELDS INTO FORMGROUPS --> ENDED UP BEING KIND OF POINTLESS AS NO FIELD VALIDATION WAS USED
export class FormService {

  constructor() { }

  toFormGroup(fields: FieldResource[] ): FormGroup {

    const group: any = {};



    fields.forEach( field => {
      group[field.field_Id] = new FormControl(null || field.value, Validators.required)
                                              
    })

    var formGroup = new FormGroup(group);


    return formGroup;
  }
}

