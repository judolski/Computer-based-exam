import { Injectable } from '@angular/core';
import { Observable, throwError, catchError, map } from 'rxjs';
import { baseURL } from '../share/baseurl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = false;

  constructor() { }


  logout() {
    sessionStorage.removeItem('user')
  }

  //http error handler
  catchAuthError(error: any): Observable<any> {
    if (error && error.error && error.error.message) {
      //client-side error
      return error.error.message;
    } 
    else if (error && error.message){
    //server-side error
    return error.message;
    } else {
      alert('Internal server error, please retry later');
    }
    return throwError(error);
  }
}
