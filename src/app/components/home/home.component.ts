import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { ApiEndpointService } from 'src/app/data-access/api-endpoint.service';
import { InitialRequestResource } from 'src/app/models/InitialRequestResource';
import { LoadingService } from 'src/app/services/loading.service';
import { MovementStoreService } from 'src/app/stores/movement-store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  trackingKey:string;
  carrierName:string;
  numberOfMovements:string;
  info:InitialRequestResource;
  begin:boolean = false;
  state:string = "begin";
  loading: boolean = false;


  constructor(private route:ActivatedRoute, private dataStore:MovementStoreService, private dataSvc:ApiEndpointService, private _loading:LoadingService) {


   }

   

  ngOnInit(): void {
    this.listenToLoading();

    this.trackingKey = this.route.snapshot.params.trackingKey;

    this.dataStore.setTrackingKey(this.trackingKey);

    this.dataSvc.getInitialTrackingInfo(this.trackingKey)
    .subscribe( json =>{
      if(json.error == null){
        var i = json.data as InitialRequestResource;
        this.info = i;
        this.carrierName = i.carrierName ? i.carrierName : "";
        this.numberOfMovements = i.numberOfMovements.toString();
      }
    })

    this.dataStore.stateChanged.subscribe(s => {
      if(s){
        if(s.questioningComplete == true){
          this.state = "done";
        }
      }
    })
    

  }

  toggleBegin(){
    this.state = "questions"
  }

  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  


}
