import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | any;
  emailMess: any;
  passwordMess: any;

  display = "none";
  spinning = "none";
  overlay = "none";

  constructor( private userService: UserService, private authService: AuthService,
    @Inject('BaseURL') public BaseURL:any, private router: Router) {
    this.createForm();
   }

  ngOnInit(): void {
  }
createForm() {
  this.loginForm = new FormGroup({
    email: new FormControl("",[ Validators.required]),
    password: new FormControl("",[Validators.required])
  });
  this.loginForm.valueChanges.subscribe((data:any) => { this.formValidation(data) });
  this.formValidation();
}

formErrors: FormGroup | any = {
    'email': '',
    'password': ''
};

formErrormsgs: any = {
  'email': {
    'required': 'Enter your Email.'
  },
  'password': {
    'required': 'Enter your password.'
  }
};

formValidation (data?: any) {
  if(!this.loginForm){return;}
  const form = this.loginForm;
  for(const field in this.formErrors) {
    if(this.formErrors.hasOwnProperty(field)) {
      // clears all errors
      this.formErrors[field] = '';
      this.passwordMess = '';
      this.emailMess = '';
      const control = form.get(field);
      if(control && control.dirty && control.invalid) {
        const errmsg = this.formErrormsgs[field];
        for(const errType in control.errors)
        if(control.errors.hasOwnProperty(errType)) {
          this.formErrors[field] += errmsg[errType] + '';
        }
      }
    }
  }
}



login() {
  if (this.loginForm.valid) {
    const formData = this.loginForm.value;
    this.userService.userLogin(formData).subscribe((user) => {
      if (user) {
      sessionStorage.setItem('user',JSON.stringify(user.userSession.email))
       
       this.menuModal();
       //alert(JSON.stringify(user.userSession))
      }
    }, (err) => {
      if (err.error.password_message) {
        this.passwordMess = <any>err.error.password_message;
      }
      if (err.error.email_message) {
        this.emailMess = <any>err.error.email_message;
      }
    })
  }
}


menuModal() {
  this.display = "block";
  this.overlay = "block";
}

closeMenuModal() {
  this.router.navigate(['/login']);
  this.display = "none";
  this.overlay = "none";
}

startTest() {
  this.router.navigate(['/questions']);
}


}
