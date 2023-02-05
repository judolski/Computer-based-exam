import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  checkUser:any;

  loginForm: FormGroup | any;
  emailMess: string | any;
  passwordMess: any;
  serverErr: string | any;
  startquiz = false;
  resumeQuiz = false;
  displayScore = false;
  score:any;
  total:Number | any;

  displayModal = "none";
  spinning = "none";
  overlay = "none";
  showLoginBtn = "block";
  eyeToggle = "fa fa-eye";
  passInputTtype = "password";
  
  constructor( private userService: UserService,
    @Inject('BaseURL') public BaseURL:any , private router: Router) {
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
          this.checkUser = user.user.firstname;
          this.hideSpinner();
          sessionStorage.setItem('token',user.token);
          sessionStorage.setItem('user',this.checkUser);
          sessionStorage.setItem('email',user.user.email);
          //clear previously saved score in the browser, if any
          localStorage.removeItem('score');

          if (user.user.score == 0 || user.user.score > 0) {
            this.userService.getquestions().subscribe((questions) => {
              this.total = questions.length;
            })
            this.score = user.user.score;
            this.startquiz = false;
            this.displayScore = true;
           localStorage.setItem('score', JSON.stringify(this.score));
          }
          else { 
            this.startquiz = true;
            this.displayScore = false;
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
    //this.router.navigate(['/questions']);
    window.open('/questions','CBT', 'toolbar=0, menubar=0, location=0');
    window.location.reload();
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
