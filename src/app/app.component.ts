import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {delay} from 'rxjs/operators';
import {LoadingService} from './services/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  constructor(private route:ActivatedRoute){


    
    
  }
  
  
  ngOnInit(): void
  {
  }
  
  


}
