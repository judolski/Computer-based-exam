import { Component, OnInit, Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewUser, Gender } from '../model/signupModel';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})


export class SignupComponent implements OnInit {

  signupForm: FormGroup | any;
  user: NewUser | any;
  genderType = Gender;
  successMsg: any;
  errorMsg: any;
  errMsg = "none";
  succMsg = "none";
  spinning = "none";
  overlay = "none";

  constructor(private userService: UserService, private authService: AuthService, 
    @Inject('BaseURL') public BaseURL:any) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.signupForm = new FormGroup({
      firstname: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(2)]),
      lastname: new FormControl("", [Validators.required,Validators.pattern('[a-zA-Z]*'), Validators.minLength(2)]),
      middlename: new FormControl("", Validators.pattern('[a-zA-Z]*')),
      gender: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(10)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(5)])
    })
  }
    get f() {
      return this.signupForm.controls;
    }

    register(){
      if(this.signupForm.valid) {
        this.showSpinner();
        const formValue = this.signupForm.value;
            this.userService.addUser(formValue).subscribe((data) => {
              if (data) {
                this.errMsg = "none";
                this.hideSpinner();
                this.successMsg = 'Registration Successful';
                return this.succcessPopup();
              } 
            },(err) => { 
              this.errMsg = "none";
              this.hideSpinner();
              this.errorMsg = this.authService.catchAuthError(err);
              return this.errorPopup();
            });
      }
     // this.signupForm.reset();
      
    }

  
  errorPopup() {
    this.errMsg = "block";
    this.overlay = "block";
  }

  succcessPopup() {
    this.succMsg = "block";
    this.overlay = "block";
  }

  closeErrorPopup() {
    this.errMsg = "none";
    this.overlay = "none";
  }
  closeSuccessPopup() {
    this.succMsg = "none";
    this.overlay = "none";
    this.signupForm.reset();
  }

  showSpinner() {
    this.spinning = "block";
  }
  hideSpinner() {
    this.spinning = "none";
  }


}
