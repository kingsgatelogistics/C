import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { InitialRequestResource } from 'src/app/models/InitialRequestResource';
import { MovementResource } from 'src/app/models/MovementResource';
import { StopResource } from 'src/app/models/StopResource';
import { MovementStoreService } from 'src/app/stores/movement-store.service';

//This component is the info bar just below nav bar featuring number of movements and Hello, Carrier Name

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.css']
})
export class InfoBarComponent implements OnInit  {
  subscriptions:Subscription[] = [];
  
  @Input() trackingKey:string;
  @Input() carrierName:string;

  info:InitialRequestResource;

  currentMovementNumber:number;
  totalMovementNumber:number;

  trackingComplete:boolean = false;


  constructor( private activatedRoute:ActivatedRoute, private dataStore:MovementStoreService) {

  };

  ngOnInit(): void {



    var sub = this.dataStore.stateChanged.subscribe(state =>
      {
        if(state){
          this.currentMovementNumber = state.activeMovementIndex + 1;
          this.totalMovementNumber = state.movements.length;
            
        }
    });

    this.subscriptions.push(sub);
    
  }


}
