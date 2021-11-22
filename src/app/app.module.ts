import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,  HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { NavComponent } from './components/nav/nav.component';
import { InfoBarComponent } from './components/info-bar/info-bar.component';
import { FieldComponent } from './components/field/field.component'; 

import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatRadioModule} from '@angular/material/radio'; 
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 

import { MovementInfoComponent } from './components/movement-info/movement-info.component';
import { MovementQuestionsComponent } from './components/movement-questions/movement-questions.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorPostAnswerDialogComponent } from './components/error-post-answer-dialog/error-post-answer-dialog.component';
import { SuccessPostAnswerDialogComponent } from './components/success-post-answer-dialog/success-post-answer-dialog.component';
import { HttpRequestInterceptor } from './services/http-request-interceptor.service';
import { HttpErrorDialogComponent } from './components/http-error-dialog/http-error-dialog.component';

//NOTES ON APPLICATION:
  //Primary business logic and state management is located in stores/movement-store.service.ts
  //http errors are handled by services/http-request-interceptor.service.ts


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    InfoBarComponent,
    FieldComponent,
    MovementInfoComponent,
    MovementInfoComponent,
    MovementQuestionsComponent,
    HomeComponent,
    ErrorPostAnswerDialogComponent,
    SuccessPostAnswerDialogComponent,
    HttpErrorDialogComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgbModule
  ],
  exports: [RouterModule],
  providers: [{provide:HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
