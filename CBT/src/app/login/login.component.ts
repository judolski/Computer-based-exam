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
  resumeQuiz = false;
  displayScore = false;
  score:any;

  displayModal = "none";
  spinning = "none";
  overlay = "none";
  showLoginBtn = "block";
  eyeToggle = "fa fa-eye";
  passInputTtype = "password"
  
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
          this.hideSpinner();
          sessionStorage.setItem('user',JSON.stringify(user.userSession.email))
          if (user.userSession.score == 0 || user.userSession.score > 0) {
            this.score = user.userSession.score;
            this.startquiz = false;
            this.displayScore = true;
          }
          else { 
            let existingTime = localStorage.getItem(JSON.stringify(user.userSession.email));
            if (user.userSession.score == null && !existingTime) {
            this.startquiz = true;
            this.displayScore = false;
            }
            else if (user.userSession.score == null && existingTime) {
            this.resumeQuiz = true;
            this.startquiz = false;
            this.displayScore = false;
            }
          }
          this.menuModal();
        }
        
      }, (err) => {
        this.hideSpinner();
        this.showLoginBtn = "block";
        if (err.error.password_message) {
          this.passwordMess = <any>err.error.password_message;
        }
        else if (err.error.email_message) {
          this.emailMess = <any>err.error.email_message;
        }
        else {
          this.serverErr = "Internal server error occur, try again later."
          setTimeout(() => {this.serverErr = null;}, 5000)
        }
      });
    }
  }

  startTest() {
    this.router.navigate(['/questions']);
  }

  eyeToggleIcon() {
    if(this.eyeToggle == "fa fa-eye") {
      this.eyeToggle = "fa fa-eye-slash";
        this.passInputTtype = "text";
    }
    else if(this.eyeToggle == "fa fa-eye-slash") {
        this.eyeToggle = "fa fa-eye";
        this.passInputTtype = "password";
    }
  }

  menuModal() {
    this.displayModal = "block";
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




}
