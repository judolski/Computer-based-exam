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
  serverErr: string | any;
  startquiz = false;
  displayScore = false;
  score:any;

  display = "none";
  spinning = "none";
  overlay = "none";
  showLoginBtn = "block";
  
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
      this.showSpinner();
      const formData = this.loginForm.value;
      this.userService.userLogin(formData).subscribe((user) => {
        if (user) {
          this.hideSpinner()
          sessionStorage.setItem('user',JSON.stringify(user.userSession.email))
          if (user.userSession.score == 0 || user.userSession.score > 0) {
            this.score = user.userSession.score;
            this.startquiz = false;
            this.displayScore = true;
          }
          else if(user.userSession.score == null) {
            this.startquiz = true;
            this.displayScore = false;
          }

          this.menuModal();
        }
        
      }, (err) => {
        this.hideSpinner()
        if (err.error.password_message) {
          this.passwordMess = <any>err.error.password_message;
          this.showLoginBtn = "block";
        }
        else if (err.error.email_message) {
          this.emailMess = <any>err.error.email_message;
          this.showLoginBtn = "block";
        }
        else {
          this.showLoginBtn = "block";
          this.fadeOutInternalErr();
        }
      })
    }
  }



  startTest() {
    this.router.navigate(['/questions']);
  }

  menuModal() {
    this.display = "block";
    this.overlay = "block";
  }

  closeMenuModal() {
    window.location.reload();
  }

  showSpinner() {
    this.spinning = "block";
    this.showLoginBtn = "none";
  }
  hideSpinner() {
    this.spinning = "none";
  }

  fadeOutInternalErr() {
    this.serverErr = true;
    setTimeout(() => {
    this.serverErr = false;
    },5000)
  }



}
