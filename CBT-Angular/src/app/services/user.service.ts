import { Injectable } from '@angular/core';
import { NewUser } from '../model/signupModel';
import { baseURL } from '../share/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  addUser(user:NewUser): Observable<any> {
    return this.http.post(baseURL + 'users/signup', user);
  }

  userLogin(user:any): Observable<any> {
    return this.http.post(baseURL + 'users/login', user);
  }

  getUser(user:any) : Observable<NewUser[] | any> {
    return this.http.post(baseURL + 'users/user', user);
  }

  updateUser(userDetail:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    return this.http.put<any>(baseURL + 'users/user', userDetail, httpOptions);
  }

  resetPassword(user:any):Observable<any> {
    return this.http.post<any>(baseURL + 'users/user/resetpassword', user);
  }

  
}
