import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ApiEndpointService } from '../data-access/api-endpoint.service';
import { InitialRequestResource } from '../models/InitialRequestResource';
import { JsonResponse } from '../models/JsonResponse';
import { map} from 'rxjs/operators';

import { MovementResource } from '../models/MovementResource';
import { StopResource } from '../models/StopResource';
import { QuestionResource } from '../models/QuestionResource';


@Injectable({
  providedIn: 'root'
})

export class QuestionService {


  private jr:JsonResponse;





  constructor(
    private dataSvc:ApiEndpointService, 
  ){}

  getInitialInfo(trackingKey:string):Observable<InitialRequestResource>{
    return this.dataSvc.getInitialTrackingInfo(trackingKey).pipe(
      map(json =>{
        if(json.error == null){
          return json.data as InitialRequestResource;
          //return this.mapToOrderProperties(info);
        }
        else{
          throw new Error(json.error.toString());
        }
      })
    );
  }

  getOpenMovements(trackingKey:string):Observable<MovementResource[]>{
    return this.dataSvc.getOpenMovements(trackingKey).pipe(
      map( json => {
        if(json.error == null){
          console.log(json);
          return json.data as MovementResource[];
        }
        else{
          throw new Error(json.error.toString());
        }
      })
    )
  }

  


  // getStopsForMovement(trackingKey:string, movementId:string):Observable<StopResource[]>{
  //   return this.dataSvc.getOpenStopsForMovement(trackingKey, movementId).pipe(
  //     map(json => {
  //       if(json.error == null){
  //         return json.data as StopResource[];
  //       }
  //       else{
  //         throw new Error(json.error.toString());
  //       }
  //     })
  //   )
  // }


  getNextQuestion(trackingKey:string, movementId:string):Observable<QuestionResource>{
    
  
    return this.dataSvc.getNextMovementQuestion(trackingKey, movementId).pipe(
      map(json => {
        if(json.error == null){
          var q = json.data as QuestionResource;

          return q;
        }
        else{
          throw new Error(json.error.toString());
        }
      }),

    )
  }

  getAllNextQuestions(trackingKey:string, movementId:string) {
    return this.dataSvc.getAllNextMovementQuestions(trackingKey, movementId).pipe(
      map(json => {
        if(json.error == null){
          return json.data as QuestionResource[];
        }
        else{
          throw new Error(json.error.toString());
        }
      })
    )
  }

  answerQuestion(questions:QuestionResource[]){
    return this.dataSvc.postAnswer(questions).pipe(
      map(json => {
        console.log(json.error)
        if(json.error == null){
          console.log("no error!")
          return json.data;
        }
        else{
          console.log("error");
          throw new Error(json.error.toString());
        }
      })
    )
  }

  // //map InitialOrderREsource into array of OrderProperty
  // private mapToOrderProperties(info:InitialRequestResource):OrderProperty[]{
  //   let keyArray = Object.keys(info);
  //   let orderInfo = [];

  //   for(let i = 0; i < keyArray.length; i++){
  //     orderInfo.push(new OrderProperty(keyArray[i].replace(/([A-Z])/g, ' $1').trim(), info[keyArray[i]]));
  //   }


  //   return orderInfo;
    

  // }


  
}



