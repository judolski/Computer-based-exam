import { Injectable } from '@angular/core';
import { NewUser } from '../model/signupModel';
import { baseURL } from '../share/baseurl';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';

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

  getUsers() : Observable<NewUser[] | any> {
    return this.http.get(baseURL + 'users');
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

  deleteUser(userId:any): Observable<any> {
    return this.http.delete(baseURL + 'users/user/'+userId);
  }


  removeScore(userId:any): Observable<any> {  
    return this.http.put<any>(baseURL + 'users/user/'+userId, userId);
  }

  

  
}
