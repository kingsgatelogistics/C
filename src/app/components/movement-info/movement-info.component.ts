
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import {faChevronUp, faLongArrowAltRight} from '@fortawesome/free-solid-svg-icons';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';

import { MovementResource } from 'src/app/models/MovementResource';
import { StopResource } from 'src/app/models/StopResource';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MovementStoreService } from 'src/app/stores/movement-store.service';
import { Subscription } from 'rxjs';

//THIS COMPONENT PROVIDES INFORMATIONAL DROP DOWNS FOR MOVEMENT INFO AND STOP INFO

@Component({
  selector: 'app-movement-info',
  templateUrl: './movement-info.component.html',
  animations:[
    trigger('detailExpanded', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),

  ],
  styleUrls: ['./movement-info.component.css']
})


export class MovementInfoComponent implements OnInit {
  subscriptions:Subscription[] = [];
  
  disableAnimations:boolean = true;

  movement:MovementResource = <MovementResource>{};
  
  stopOrMovementOpen:string;
  
  stopNeeded:boolean = false;
  stop:StopResource = <StopResource>{};
  stopUpChevron:boolean = false;
  
  @ViewChild('movementInfoContainer') movementDisplay;
  @ViewChild('stopInfoContainer') stopDisplay;
  
  activeDisplay: any | null;

  // movementInfoContainer: ElementRef;
  // movementProperties:KeyValueDisplay[];
  
  movementOpen:boolean = true;

  faChevronUp = faChevronUp;
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  faChevronDown = faChevronDown;
  faLongArrowRight = faLongArrowAltRight;

  showData:boolean = false;

  constructor(private dataStore:MovementStoreService) {

  }

  
  
  ngOnInit(): void {
    var sub1 = this.dataStore.stateChanged.subscribe(state =>{
      if(state){

        
        this.stop = state.activeStop;
        if(this.stop){
          if(this.stop.sched_arrive_early_date){
            this.stop.sched_arrive_early_date = this.stop.sched_arrive_early_date.replace(" 00:00:00", "");

          }
          if(this.stop.sched_arrive_late_date){
            this.stop.sched_arrive_late_date = this.stop.sched_arrive_late_date.replace(" 00:00:00", "");

          }
        }
        this.stopNeeded = state.displayStop;
        this.movement = state.activeMovement;
        
      }
    });



    this.subscriptions.push(sub1); 

  }



  toggleOpenInfo(element:string){
    
    if(this.disableAnimations == true){
      this.disableAnimations = false;
    }


    if(element == "stop"){
      this.activeDisplay = this.activeDisplay == this.stopDisplay ? null : this.stopDisplay; 

    }

    if(element == "movement"){
      this.activeDisplay = this.activeDisplay == this.movementDisplay ? null : this.movementDisplay; 
    }


    if(this.activeDisplay != null){
      this.stopUpChevron = true;
    }
    else{
      this.stopUpChevron = false;
    }

    // else{
    //   this.activeDisplay = null;
    // }

  }




  // getmovementInfoContainerHeight(){
  //   console.log(this.movement);
  //   console.log("movement");
  //   console.log(Object.keys(this.movement).length);
  //   //row height * number of rows + padding + height of other element
  //   var height = 15 * Object.keys(this.movement).length + 8 + 31;
  //   var returnHeight = height + "px";
  //   return returnHeight;
  // }

  // getstopInfoContainerHeight(){
  //   //row height * number of rows + padding + height of other element
  //   var exStop = new StopResource();
  //   var height = 15 * Object.keys(exStop).length + 8 + 31;
  //   var returnHeight = height + "px";
  //   return returnHeight;
  // }

}
