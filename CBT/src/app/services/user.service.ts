import { Injectable } from '@angular/core';
import { NewUser } from '../model/signupModel';
import { baseURL } from '../share/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  addUser(user:NewUser): Observable<any> {
    return this.http.post(baseURL + 'user/signup', user);
  }

  getUsers() : Observable<NewUser[]> {
    return this.http.get<any>(baseURL + 'user')
    .pipe(catchError(err => this.catchAuthError(err)))
  }

  //http error handler
  catchAuthError(error: any): Observable<any> {
    if (error && error.error && error.error.message) {
      //client-side error
      return error.error.message;
    } else if (error && error.message){
    //server-side error
      return error.message;
    } else {
      console.log(JSON.stringify(error));
    }
    return throwError(error);
  }

  
}
