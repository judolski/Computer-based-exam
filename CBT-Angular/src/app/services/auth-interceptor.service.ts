import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService:AuthService) { }

  intercept(req: HttpRequest<any> , next: HttpHandler) {
    //console.log("Interception in progress");
    let token = this.authService.getToken();
    if (token) {
      const cloned = req.clone({ headers: req.headers.set('Authorization', token) });
      return next.handle(cloned);
    } 
    else {
      return next.handle(req);
    }
   
  }
}
