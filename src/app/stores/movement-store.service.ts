import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { FieldResource } from '../models/FieldResource';
import { MovementResource } from '../models/MovementResource';
import { QuestionResource } from '../models/QuestionResource';
import { StopResource } from '../models/StopResource';

import { ErrorPostAnswerDialogComponent } from '../components/error-post-answer-dialog/error-post-answer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPostAnswerDialogComponent } from '../components/success-post-answer-dialog/success-post-answer-dialog.component';
import { ApiEndpointService } from '../data-access/api-endpoint.service';


@Injectable({
  providedIn: 'root'
})

//STATE MANAGEMENT:


//maintenence object explained:
  // export interface StoreState{
  //   movements:MovementResource[];  //list of all open movements --> used to track total number of movements and to iterate over each. length is accessed by info-bar component
  //   activeMovement:MovementResource; //current movmement being worked --> accessed by movement-info component to display details
  //   activeMovementIndex:number; //index of activeMovement in movements --> accessed by to info-bar to display progress through movement iteration

  //   questions:QuestionResource[]; //list of all open questions for current activeMovement --> iterated over by 
  //   activeQuestion:QuestionResource; current question being worked--> accessed by movement-questions component, fields are then parsed into field components
  //   questionCount:number; //total number of questions for activeMovement--> accessed by movement-questions component to display progress through question iteration
  //   activeQuestionIndex:number; //index of activeQuestion in questions --> accessed by movement-questions component to display progress

  //   stops:StopResource[]; //list of all stops associated with a movement
  //   activeStop:StopResource; //currentStop being displayed -->  accessed by movement-info component to display stop details
  //   displayStop:boolean; //indication of whether to display stop details, determined by question.need_stops_for_movement

  // }

//NOTES:
  //There are 2 "Magic Strings" that could provide issues in the future
    //1. [STOP_NAME] substitute in question.text
    //2. "Arrive" and "Depart" in question.field.name to map question.field.value to stop datetimes

//FOR FUTURE REFACTORING:
  //1. ensure that intial info is obtained before open movements
      //an expired tracking key cause 2 error dialog boxes to appear("tracking key not found" and "no open movements") as both initalinfo and openmovement endpoints return a 404
  //2. Call api answerquestion endpoint after each question instead of after each movement. Currently backend is only called after completion of all questions in a movement, and then an array of question answer objects is sent.
    //All questions were required by the backend for analysis that determined the response field of the McLeod CallIn api object. Now with a 1:1 question to api call configuration, can 
    //call backend after every question. This would provide clearer and more immediate validation and allow for more dispersed loading times. 


export class MovementStoreService extends ObservableStore<StoreState>{
  

  constructor(public dialog: MatDialog, private endpointSvc:ApiEndpointService, ) {
    super(  
      {
        trackStateHistory: true
      });

      //Set inital state
      const initialState = {
        movements:[],
        activeMovement:null,
        activeMovementIndex:0,
  
        stops:[],
        activeStop:null,
        displayStop:false,
  
        questions:[],
        activeQuestion:null,
        questionCount:0,
        activeQuestionIndex:0
  
      }

      this.setState(initialState, ActionsEnum.InitializeState, false);

  }

  private trackingKey:string;

  //suplied from Home Component
  setTrackingKey(key:string){
    this.trackingKey = key;
    this.fetchMovements();
  }


  // getCurrentMovementCount(){
  //   var state = this.getState(); 

  //   return state.movements.indexOf(state.activeMovement) + 1;
  // }

  //iterate to next movement
  //can be called by a number of places
  nextMovement(){

    var state = this.getState();
    var movement:MovementResource;
    //
    var index = state.activeMovementIndex;

    if(state.activeMovement){
      var activeMovementIndex = state.movements.indexOf(state.movements.filter(m => m.movement_id == state.activeMovement.movement_id)[0]);

      if(activeMovementIndex >= 0){
        movement = activeMovementIndex < state.movements.length -1 ? state.movements[activeMovementIndex + 1] : null;
        //indicates all movements have been iterated over
        if(movement == null){
          this.completeQuestioning();
          return;
        }

        index = state.activeMovementIndex + 1;

      }
      else{
        console.log("ERROR finding activeMovementIndex");
      
      }
    }
    else{
      if(state.movements.length > 0){
        movement = state.movements[0];
      }
      else{
        this.fetchMovements();
      }
    }

    if(movement != null){
      
      this.setNewMovementState(movement, index)

      this.nextQuestion();
    }


  }

  //do resets for state values dependent on new movement
  setNewMovementState(movement:MovementResource, index:number){
    this.setState({activeMovementIndex: index}, ActionsEnum.IncrementMovementIndex, false);
    this.setState({activeMovement : movement}, ActionsEnum.NextMovement, false);
    if(movement.openStops){
      this.setState({stops:movement.stops}, ActionsEnum.ResetStops, false);
      this.setState({activeStop:movement.stops[0]}, ActionsEnum.ActiveStop, false);
    }
    else{
      this.setState({stops:null}, ActionsEnum.ResetStops, false);
      this.setState({activeStop:null}, ActionsEnum.ActiveStop, false);
    }
    
    this.setState({questions: null}, ActionsEnum.ResetQuestions, false);
    this.setState({activeQuestion:null}, ActionsEnum.ResetActiveQuestion, false);
    this.setState({questionCount: movement.unansweredQuestions}, ActionsEnum.QuestionCount, false);
    this.setState({activeQuestionIndex:0}, ActionsEnum.IncrementQuestionIndex, false);
  }



  



//iterate to next question and add stop to question if question.need_stops_for_movement && question.stop_id
//fetch questions if none have been fetched yet
//set active question
//set question display index --> activequestionindex
  nextQuestion(){
    var state = this.getState();

    var question:QuestionResource;

    if(!state.questions){
      this.fetchQuestions();
      return;
    }
    
    var initialSet = true;

    if(!state.activeQuestion){
      question = state.questions[0];
    }else{
      initialSet = false;
    }
    var currentQuestionIndex = 0;
  
    if(!initialSet){
      currentQuestionIndex = state.questions.indexOf(state.questions.filter(x => x.recordId == state.activeQuestion.recordId)[0]);
      question = currentQuestionIndex < state.questions.length - 1? state.questions[currentQuestionIndex + 1] : null;
      if(!question){
        this.terminateMovement();
            return;
      }

    }
    //value for displaying what number question
    var displayIndex = state.activeQuestionIndex + 1;
    this.setState({activeQuestionIndex: displayIndex}, ActionsEnum.IncrementQuestionIndex, false);



    //add stop if needed
    // MAK change to always adding next open stop to question if need_stops_for_movement (eliminate && question.stop_id)
    // MAK check that stop list comes from open stops and not all stops
    //if(question.need_stops_for_movement && question.stop_id){
    if(question.need_stops_for_movement) {
        question = this.addStopToQuestion(question, state.activeQuestionIndex);



      //no matching open stop for question --> skip to next question
      if(!question.stop){
        this.setState({activeQuestion : question}, ActionsEnum.NextQuestion, false);
        this.nextQuestion();
        return;
      }

      this.setState({displayStop:true}, ActionsEnum.DisplayStop, false);
    }

    this.setState({activeQuestion : question}, ActionsEnum.NextQuestion);


  }

  //add stop and parse stop name into question text
  addStopToQuestion(question:QuestionResource, activeQuestionIndex:number):QuestionResource{
    var state = this.getState();
    var newquestions = state.questions;
    // MAK set question.stop_id to first available stop in list (at this point I'm assuming state.stops contains only open stops)
    // MAK Dont need the below if, the question.stop_id exists and is used to lookup the stop in state object next statement
    // if(state.stops.length>0) {
    //   question.stop_id = state.stops[0].stop_id;
    // }

    var stop = state.stops.filter(s => s.stop_id == question.stop_id)[0] as StopResource;
    if(stop){
      question.stop = stop;
      //MAGIC STRING --> '[STOP_NAME]' in question text replaced with active stop location city state
      question.question_text = question.question_text.replace("[STOP_NAME]", stop.stop_location_name.trim() 
                                                              + ", " + stop.stop_city_name.trim() 
                                                              + " " + stop.stop_state.trim());

      newquestions[activeQuestionIndex]=question;                                                        

      this.setState({questions : newquestions}, ActionsEnum.UpdateQuestions );                                                        
    }

    return question;
  }

  //iterate to next stop 
  nextStop(){
    var state = this.getState();
    var newActiveStop:StopResource;

    if(state.activeStop){
      var stopIndex = state.stops.indexOf(state.stops.filter(s => s.stop_id == state.activeStop.stop_id)[0]);

      if(stopIndex > -1){
        newActiveStop = stopIndex < state.stops.length - 1 ? state.stops[stopIndex + 1] : null;
        this.setState({activeStop:newActiveStop}, ActionsEnum.ActiveStop, false);
      }

    }
  }

  //end question
  terminateQuestion(question:QuestionResource){
    this.recordAnswerState(question);

    this.nextQuestion();

  }

  //end stop
  terminateStop(question:QuestionResource){
    var state = this.getState();
    this.recordAnswerState(question);

    this.nextStop();
    this.nextQuestion();
  }

  terminateMovement(question?:QuestionResource){

    var state = this.getState();


    if(question){
      state = this.recordAnswerState(question);
      
    }
    
    this.endpointSvc.postAnswer(state.questions)
    .subscribe(json =>{
      if(json.error == null){
        this.openSuccessDialog(state.activeMovement.order_numbers)
      }
      else{
        this.openErrorDialog(json.error.toString());
        
      }
      
    
    },
      error => {
        console.log(error);
      }
    );

    
  }

  openSuccessDialog(order_id:string){
    const dialogRef = this.dialog.open(SuccessPostAnswerDialogComponent, {
      width: '320px',
      disableClose:true,
      data:{orderId:order_id}

    });

    dialogRef.afterClosed().subscribe(result =>{
      this.nextMovement();
    });
  }


  openErrorDialog(err:any){
    const dialogRef = this.dialog.open(ErrorPostAnswerDialogComponent, {
      width: '320px',
      data: {error: err, result:""},
      disableClose:true
    } );

    dialogRef.afterClosed().subscribe(result => {
      if(result == "tryAgain"){
        this.terminateMovement();
      }
      if(result == "nextMovement"){
        this.nextMovement();
      }
      if(result == "reenter"){
        var state = this.getState();
        this.setNewMovementState(state.activeMovement, 0);
        
        this.nextQuestion();
      }
      

    });
  }


  //add question field answers to matching member of state.questions. also if datetime, format to McLeod readable format and map to matching stop
  recordAnswerState(question:QuestionResource): StoreState{
    var state = this.getState();

    var matchingQuestion = state.questions.filter(s => s.recordId == question.recordId)[0] as QuestionResource;


    matchingQuestion.fields = question.fields; 


    if(matchingQuestion.stop){
      for (var f of matchingQuestion.fields){
        if(f["type"] == "DATE" || f["type"] == "TIME"){
          
          if(f["value"] != null && f["value"] != "" ){
            //get McLeod formatted field
            this.mapDateTimeAnswer(f);
            matchingQuestion.dateTimeAnswered = true;
            this.mapDateTimeAnswerToStop(matchingQuestion, f);
          }
        }
      }
    }


    
    

    this.setState({questions: state.questions}, ActionsEnum.SetQuestionAnswerValue, false);


    
    
    var a = this.getState();
    return a;
  }

  //FORMAT DATETIME INTO MCLEOD READABLE FORMAT
  mapDateTimeAnswer(answer:FieldResource):FieldResource{
    if(answer.type == "TIME"){

      if(answer.value.hour != undefined){
        var hour = answer.value.hour.toString();
        if(hour.length < 2){
          hour = "0" + hour;
        }
  
        var minute = answer.value.minute.toString();
        if(minute.length < 2){
          minute = "0" + minute;
        }
  
        var timeFormatted = hour +  minute + "00";
  
        answer.value = timeFormatted;
      }

      return answer;

    }

    if(answer.type == "DATE"){
      var date = new Date(answer.value); 
      var year =  date.getFullYear().toString().length < 2 ? "0" + date.getFullYear() : date.getFullYear().toString();
      var monthNum = date.getMonth() + 1;
      var month = monthNum.toString();
      if(month.toString().length < 2){
        month = "0" + month;
      };
      var dayNum = date.getDate();
      var day = dayNum.toString();

      if (day.length < 2){
        day = "0" + day;
      }
      
      var formattedDate = month + "/" + day + "/" + year;

      answer.value = formattedDate;

      return answer;
      
    }

    return answer;


  }




  //THIS IS A WEAK POINT THAT SHOULD BE REFACTORED --> DEPENDENT ON MAGIC STRING "ARRIVAL" AND "DEPART" TO MAP QUESTION FIELDS TO STOP FIELDS
  //HOW ELSE TO DICTATE WHETHER A DATETIME FIELD CAN BE MAPPED TO arrive_time or departure_time OF STOP?
  mapDateTimeAnswerToStop(question:QuestionResource, answer:FieldResource){
    if(answer.type == "TIME"){

      if(answer.name.indexOf("Arrival") > -1){
        question.stop.actual_arrival_time = answer.value;
      }
      else if(answer.name.indexOf("Depart") > -1){
        question.stop.actual_departure_time = answer.value;
      }
    }

    if(answer.type == "DATE"){
      if(answer.name.indexOf("Arrival") > -1){
        question.stop.actual_arrival_date = answer.value;
      }
      else if(answer.name.indexOf("Depart") > -1){
        question.stop.actual_departure_date = answer.value;
      }
    }




  }



  fetchMovements(){
    var sub1 = this.endpointSvc.getOpenMovements(this.trackingKey).subscribe(json =>{
      if(json.error == null){
        var m = json.data as MovementResource[];
        if(m){

          this.setState({movements: m}, ActionsEnum.FetchMovements, false);
          // this.setState({activeMovement:m[0]}, ActionsEnum.SetActiveMovement, false);
          this.nextMovement();
        }
      } else{

      }
    })
  }

  fetchQuestions(){
    var state = this.getState();

    var sub1 = this.endpointSvc.getAllNextMovementQuestions(this.trackingKey, state.activeMovement.movement_id).subscribe(json => {
      if(json.error == null){
        var q = json.data as QuestionResource[];
        if(q){
      
          this.setState({questions: q}, ActionsEnum.FetchQuestions, false);
          //this.setState({activeQuestion: q[0]}, ActionsEnum.SetActiveQuestion, false);

          this.nextQuestion();

        }
      }
    });
  }

  completeQuestioning(){
    this.setState({questioningComplete:true}, ActionsEnum.CompleteQuestioning);
  }
  
  // fetchStops(question:QuestionResource){
  //   var state = this.getState();

  //   var sub1 = this.dataSvc.getStopsForMovement(this.trackingKey, state.activeMovement.movement_id).subscribe(s => {
      
  //     this.setState({stops: s}, ActionsEnum.FetchStops, false);
  //     this.setState({activeStop: s[0]}, ActionsEnum.ActiveStop, false);
  //     var qSearch = question.question_text.search("[STOP_NAME]");
  //     if(qSearch > -1){
  //       question.question_text.replace("[STOP_NAME]", state.activeStop.stop_location_name);
  //     };

  //     this.setState({displayStop:true}, ActionsEnum.DisplayStop);


  //   });
  // }
   
}

export enum ActionsEnum{
  InitializeState = "INITIALIZE_STATE",
  FetchMovements = "FETCH_MOVEMENTS",
  FetchQuestions = "FETCH_QUESTIONS",
  FetchStops = "FETCH_STOPS",
  ActiveStop = "ACTIVE_STOP",
  ResetStops = "RESET_STOPS",
  UpdateActiveStopDateTime = "UPDATE_ACTIVESTOPDATETIME",
  DisplayStop = "DISPLAY_STOP",
  NextMovement = "NEXT_MOVEMENT",
  SetActiveMovement = "SET_ACTIVEMOVEMENT",
  SetActiveQuestion = "SET_ACTIVEQUESTION",
  NextQuestion = "NEXT_QUESTION",
  ResetQuestions = "RESET_QUESTIONS",
  ResetActiveQuestion = "RESET_ACTIVEQUESTION",
  IncrementMovementIndex = "INCREMENT_MOVEMENTINDEX",
  QuestionCount = "QUESTION_COUNT",
  IncrementQuestionIndex = "INCREMENT_QUESTIONINDEX",
  SetQuestionAnswerValue = "SET_QUESTIONANSWERVALUE",
  CompleteQuestioning = "COMPLETE_QUESTIONING",
  UpdateQuestions = "UPDATE_QUESTIONS"
}

export interface StoreState{
  movements:MovementResource[];
  activeMovement:MovementResource;
  activeMovementIndex:number;


  stops:StopResource[];
  activeStop:StopResource;
  displayStop:boolean;

  questions:QuestionResource[];
  activeQuestion:QuestionResource;
  questionCount:number;
  activeQuestionIndex:number;

  questioningComplete:boolean;

}
