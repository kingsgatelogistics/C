import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnswerResource } from '../models/AnswerResource';
import { JsonResponse } from '../models/JsonResponse';
import { QuestionResource } from '../models/QuestionResource';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiEndpointService {

  //url:string = "";
  //url:string = "https://localhost:64743/";

  url:string = environment.baseApiUrl;

  constructor(private http:HttpClient) {
  }

  getInitialTrackingInfo(trackingKey:string):Observable<JsonResponse>{
    var params = new HttpParams()
    .set("trackingKey", trackingKey);
    
    return this.http.get(this.url + "initiatetrackingrequest", {params}) as Observable<JsonResponse>;

  }   

  getOpenMovements(trackingKey:string):Observable<JsonResponse>{
    var params = new HttpParams()
    .set("trackingKey", trackingKey);

    return this.http.get(this.url + "openmovements", {params}) as Observable<JsonResponse>;

  }
  //not used, instead all 
  getNextMovementQuestion(trackingKey:string, movmentId:string):Observable<JsonResponse>{
    var params = new HttpParams()
    .set("trackingKey", trackingKey)
    .set("movementId", movmentId);

    return this.http.get(this.url + "nextmovementquestion", {params}) as Observable<JsonResponse>;

  }

  getAllNextMovementQuestions(trackingKey:string, movmentId:string):Observable<JsonResponse>{
    var params = new HttpParams()
    .set("trackingKey", trackingKey)
    .set("movementId", movmentId);

    return this.http.get(this.url + "allmovementquestions", {params}) as Observable<JsonResponse>;

  }

  getOpenStopsForMovement(trackingKey:string, movmentId:string):Observable<JsonResponse>{
    var params = new HttpParams()
    .set("trackingKey", trackingKey)
    .set("movementId", movmentId);

    return this.http.get(this.url + "openstopsformovement", {params}) as Observable<JsonResponse>;

  }

  getAllStopsForMovement(trackingKey:string, movmentId:string):Observable<JsonResponse>{
    var params = new HttpParams()
    .set("trackingKey", trackingKey) 
    .set("movementId", movmentId);

    return this.http.get(this.url + "allstopsformovement", {params}) as Observable<JsonResponse>;

  }

  postAnswer(answer:QuestionResource[]):Observable<JsonResponse>{

    return this.http.post<any>(this.url + "answerquestion", answer) as Observable<JsonResponse>;
  }

  getError(errMsg:string):Observable<JsonResponse>{
    var params = new HttpParams()
    .set("errMsg", errMsg);

    return this.http.get(this.url + "throwError", {params}) as Observable<JsonResponse>;
  }

  // putCompleteQuestion(trackingKey:string, questionRecordId){
  //   var params = new HttpParams()
  //   .set("trackingKey", trackingKey)
  //   .set("questionRecordId", questionRecordId);

  //   return this.http.put(this.url + "allstopsformovement", null, {params}) as Observable<JsonResponse>;
  // }

  
}
