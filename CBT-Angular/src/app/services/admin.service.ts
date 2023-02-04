import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../share/baseurl';
import { Observable } from 'rxjs';
import { Question } from '../model/setquestion';
import { NewUser } from '../model/signupModel';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  adminLogin(user:any): Observable<any> {
    return this.http.post<any>(baseURL + 'admin/login', user);
  }

  refreshToken(user:any) {
    return this.http.post<any>(baseURL + 'admin/refreshToken', user);
  }

  getAdmin(user:any): Observable<any> {
    return this.http.get<any>(baseURL + 'admin', user);
  }

  getQuestions() : Observable<Question[] | any> {
    return this.http.get(baseURL + 'admin/questions');
  }

  getquestion(questionId:any): Observable<any> {
    return this.http.get<any> (baseURL+ 'admin/questions/question/'+questionId);
  }

  updateData(data:any, endPoint: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/json'
      })
    };
    return this.http.put<any>(baseURL + endPoint, data, httpOptions);
  }

  deleteQuestion(questionId:any) : Observable<Question[] | any> {
    return this.http.delete(baseURL + 'admin/questions/question/'+questionId);
  }

  getUsers() : Observable<NewUser[] | any> {
    return this.http.get(baseURL + 'admin/users');
  }

  getUser(userId:any) : Observable<NewUser[] | any> {
    return this.http.get(baseURL + 'admin/users/user/'+ userId);
  }

  deleteUser(userId:any): Observable<any> {
    return this.http.delete(baseURL + 'admin/users/user/'+userId);
  }

  removeScore(userId:any): Observable<any> {  
    return this.http.put<any>(baseURL + 'admin/users/user/'+userId, userId);
  }
}