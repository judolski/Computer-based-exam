import { Injectable } from '@angular/core';
import { Question } from '../model/setquestion';
import { Observable, throwError, catchError, map } from 'rxjs';
import { baseURL } from '../share/baseurl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  addQuestion(question:Question): Observable<any> {
    return this.http.post(baseURL + 'question/setquestion', question)
  }

  getquestions() : Observable<any> {
    return this.http.get(baseURL + 'question')
    .pipe(catchError(err => this.catchAuthError(err)))
  }

  getquestion(num: Question|any): Observable<any> {
    return this.http.get<any> (baseURL+ 'question/' + num)
    .pipe(catchError(err => this.catchAuthError(err)))
  }

  getquestionIds(): Observable<number[] | any> {
    return this.getquestions().pipe(map(questions => questions.map((question:any) => question.num)))
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
      alert(JSON.stringify(error));
    }
    return throwError(error);
  }
}
