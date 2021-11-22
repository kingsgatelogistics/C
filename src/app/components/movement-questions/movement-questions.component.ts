import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormArray } from '@angular/forms';


import { FormService } from 'src/app/services/form.service';

import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { QuestionResource } from 'src/app/models/QuestionResource';
import { FieldResource } from 'src/app/models/FieldResource';
import { MovementResource } from 'src/app/models/MovementResource';
import { of, Subscription } from 'rxjs';
import { MovementStoreService } from 'src/app/stores/movement-store.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-movement-questions',
  templateUrl: './movement-questions.component.html',
  styleUrls: ['./movement-questions.component.css']
})

//THIS COMPONENT PROVIDES A CONTAINER TO HANDLE QUESTION LOGIC AND TO MANAGE FIELDS, PASSING AN ACTIVE FIELD TO FIELD COMPONENT
export class MovementQuestionsComponent implements OnInit {
  
  
  // @Input() movement:MovementResource;
  @Input() trackingKey:string;
  // @Input() stopId:string = "";

  // @Output() movementCompleted = new EventEmitter();
  // @Output() stopComplete = new EventEmitter();
  // @Output() stopsNeeded = new EventEmitter();

  subscriptions:Subscription[] = [];

  // questions:QuestionResource[];
  activeQuestion:QuestionResource;
  totalQuestions:number;
  currentQuestion:number;
  // lastQuestionId:number;

  fields:FieldResource[];
  activeField:FieldResource;
  lastFieldId:string;
  firstFieldId:string;

  fieldForm:FormGroup;
  nullFieldError:boolean = false;


  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  loading:boolean;
  
  constructor(private formService:FormService, private dataStore:MovementStoreService, private loadingService:LoadingService) {
      
  }
  
  ngOnInit(): void {
    //get all questions to iterate
    let sub1 = this.dataStore.stateChanged.subscribe(state =>{
      if(state){
        if(state.activeQuestion){
          this.activeQuestion = state.activeQuestion;
          this.currentQuestion = state.activeQuestionIndex;
          this.totalQuestions = state.questionCount;
          this.setFields();
        }
      }

      //Don't show any field components if loading
      let sub2 = this.loadingService.loadingSub.subscribe(loadingState =>{
        this.loading = loadingState;
      })

    });

    //let sub2 = this.dataStore.getActiveQuestion().subscribe();

    // let sub1= this.qDService.getAllNextQuestions(this.trackingKey, this.movement.movement_id).subscribe(
    //   qs =>{
    //     this.questions = qs;
    //     this.questions.forEach(q => q.trackingKey = this.trackingKey);
    //     this.activeQuestion = this.questions[0];
    //     this.lastQuestionId = this.questions[this.questions.length -1].questionId;


    //     this.checkIfStopsNeededForActiveQuestion();
    //     this.setFields();

      

    //   }
    // );

    this.subscriptions.push(sub1);
  }

  ngOnDestroy():void{
    this.subscriptions.forEach(x => {
      if(!x.closed) {
        x.unsubscribe();
      }
    });
  }


  onAnswerFormSubmit(formdata: any):void{
    this.nextField(formdata);
  }

  setFields(){

    this.fields = this.activeQuestion.fields;
    this.lastFieldId = this.fields[this.fields.length-1].field_Id;
    this.firstFieldId = this.fields[0].field_Id;
    this.activeField = this.fields[0];

    this.fieldForm = this.formService.toFormGroup(this.fields);
  }



  nextField(formdata){
    this.captureFieldValue(formdata);
     

    //cast field value as bool if selectbit type ==> allow for proceed logic 
    if(this.activeField.type == "SELECTBIT"){
      this.activeField.value = this.activeField.value == null ? false : this.activeField.value; 
    }

    //first field and bool? --> activate question.
    if(this.activeField.field_Id == this.firstFieldId && this.activeField.type == "BIT" || this.activeField.type == "SELECTBIT"){
      if(this.terminateField1()){
        return;
      }
    }


    if(this.activeField.iFpopulatemovenextstop && this.activeField.value != null){
        this.dataStore.terminateStop(this.activeQuestion);
        return;
    }

    //don't allow null answers
    // this.nullFieldError = false; 
    
    this.activeField = this.activeField != this.activeQuestion.fields[this.activeQuestion.fields.length - 1] ? this.fields[this.fields.findIndex(x => x.field_Id == this.activeField.field_Id) + 1] : null;
    
    //if no more fields, terminate question
    if(this.activeField == null){
      
      //check for null field answers to determine going to next question or next movement
      //if any null field answers terminate movement --> user must provide complete stop info in order to go on to next stop. otherwise, go to next movement
      var nullAnswers = false;
      this.activeQuestion.fields.forEach(m => {
        if(m.value == null){
          nullAnswers = true;
          
        }
      })
      
      if(nullAnswers){
        this.dataStore.terminateMovement(this.activeQuestion);
        return;
      }

      this.dataStore.terminateQuestion(this.activeQuestion);
    }
    

    // this.nullFieldError = true;
  }

  prevField(formdata:any){
    this.nullFieldError = false;
    this.activeField = this.fields[this.fields.findIndex(x => x.field_Id ==this.activeField.field_Id) - 1];
  }

  //relate form input to data object
  captureFieldValue(formData:any){
     this.activeField.value = formData.value[this.activeField.field_Id];
  }

  //handle the proceed_field1iFbitEQ --> iFnotproceed_terminatewhich
  terminateField1():boolean{
    if(this.activeField.value != this.activeQuestion.proceed_field1iFbitEQ ){
      switch (this.activeQuestion.iFnotproceed_terminatewhich){
        case "Terminate Question": {
          this.dataStore.terminateQuestion(this.activeQuestion);
          return true;
        }
        case "Terminate Stop":{
          this.dataStore.terminateStop(this.activeQuestion);
          return true;
        }
        case "Terminate Movement":{
          console.log("terminating movement with ")
          console.log(this.activeQuestion);
          this.dataStore.terminateMovement(this.activeQuestion);
          return true;
        }
        default:{
          return true;
        } 
      }
    } 
    return false;
  }



}
