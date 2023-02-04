import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Gender } from '../model/signupModel';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})


export class SignupComponent implements OnInit {

  signupForm: FormGroup | any;
  genderType = Gender;
  successMsg: string | any;
  errorMsg: string | any;
  spinning = "none";
  pass_eyeToggle = "fa fa-eye";
  cpass_eyeToggle = "fa fa-eye";
  passwordType = "password";
  cpasswordType = "password";
  @ViewChild('sform') signupFormDirective: any;

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
      password: new FormControl("", [Validators.required, Validators.minLength(5)]),
      cpassword: new FormControl("", [Validators.required])
    }, {validators: this.passwordMatch()});
  }
    get f() {
      return this.signupForm.controls;
    }

    passwordMatch(): ValidatorFn { 
      return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password');
        const cpassword = control.get('cpassword');
        return password?.value !== cpassword?.value ? {misMatched: true}: null;
      }
    }

    register(){
      if(this.signupForm.valid) {
        this.showSpinner();
        const formValue = this.signupForm.value;
        this.userService.addUser(formValue).subscribe((data) => {
          if (data) {
            this.hideSpinner();
            localStorage.removeItem(JSON.stringify(formValue.email));
            this.errorMsg = false;
            this.successMsg = 'Registration Successful';
            this.signupFormDirective.resetForm();
          } 
        },(err) => { 
          this.hideSpinner();
          this.successMsg = false;
          this.errorMsg = this.authService.catchAuthError(err);
          setTimeout(() => {this.errorMsg  = null;}, 5000)
        });
      }
    }


  showSpinner() {
    this.spinning = "block";
  }
  hideSpinner() {
    this.spinning = "none";
  }

  passToggleEyeIcon() {
    if (this.pass_eyeToggle == "fa fa-eye") {
      this.pass_eyeToggle = "fa fa-eye-slash";
      this.passwordType = "text";
    }
    else if (this.pass_eyeToggle == "fa fa-eye-slash") {
      this.pass_eyeToggle = "fa fa-eye";
      this.passwordType = "password";
    }
  }

  cpassToggleEyeIcon() {
    if (this.cpass_eyeToggle == "fa fa-eye") {
      this.cpass_eyeToggle = "fa fa-eye-slash";
      this.cpasswordType = "text";
    }
    else if (this.cpass_eyeToggle == "fa fa-eye-slash") {
      this.cpass_eyeToggle = "fa fa-eye";
      this.cpasswordType = "password";
    }
  }

}
