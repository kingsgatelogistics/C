import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { QuestionService } from '../services/question.service';

@Injectable({
  providedIn: 'root'
})
export class InitialInfoResolverService implements Resolve<any>{

  constructor(private dataSvc:QuestionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var trackingKey = route.params.trackingKey;

    return this.dataSvc.getInitialInfo(trackingKey);
  }
}
