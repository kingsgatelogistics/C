import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from 'rxjs/operators'
import {LoadingService} from './loading.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorDialogComponent } from '../components/http-error-dialog/http-error-dialog.component';
import { JsonResponse } from '../models/JsonResponse';

/**
 * This class is for intercepting http requests. When a request starts, we set the loadingSub property
 * in the LoadingService to true. Once the request completes and we have a response, set the loadingSub
 * property to false. If an error occurs while servicing the request, set the loadingSub property to false.
 * @class {HttpRequestInterceptor}
 */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    public dialog: MatDialog,
    private _loading: LoadingService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loading.setLoading(true, request.url);
    return next.handle(request)
      .pipe(catchError((err) => {
        this._loading.setLoading(false, request.url);
        console.log(err);
        if(err instanceof HttpErrorResponse){
          if(err.status == 404){
            var errorText = err.error as JsonResponse;

            console.log(errorText);
            this.openErrorDialog(errorText.error.toString());
          }
          else{
            this.openErrorDialog(err.statusText);
          }

        }
        
        return err;
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this._loading.setLoading(false, request.url);
        }
        return evt;
      }));
  }


  openErrorDialog(errorMsg:string){
    const dialogRef = this.dialog.open(HttpErrorDialogComponent, {
      width: '320px',
      disableClose:true,
      data:{errorMessage:errorMsg}

    });

    dialogRef.afterClosed().subscribe(result =>{
      window.location.reload();
    });
  }
}