import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) { }

  logout(token: string, userId?:any,) {
    sessionStorage.removeItem(token);
    sessionStorage.removeItem(userId);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    let authToken = this.getToken();
    return authToken !== null? true : false;
  }

  //http error handler
  catchAuthError(error: any): Observable<any> {
    if (error && error.error && error.error.message) {
      //client-side error
      return error.error.message;
    } 
    else if (error && error.message){
    //server-side error
    error.message = 'Internal server error, please retry later';
    return error.message;
    }
    return throwError(error);
  }
}
