import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | any;

  constructor() {
    this.createForm();
   }

  ngOnInit(): void {
  }
createForm() {
  this.loginForm = new FormGroup({
    email: new FormControl("",[ Validators.required]),
    password: new FormControl("",[Validators.required])
  });
  this.loginForm.valueChanges.subscribe((data:any) => this.formValidation(data));
  this.formValidation();
}

formErrors: FormGroup | any = {
    'email': '',
    'password': ''
};

formErrormsgs: any = {
  'email': {
    'required': 'Enter your Email.',
  },
  'password': {
    'required': 'Enter your password'
  }
};

formValidation (data?: any) {
  if(!this.loginForm){return;}
  const form = this.loginForm;
  for(const field in this.formErrors) {
    if(this.formErrors.hasOwnProperty(field)) {
      this.formErrors[field] = '';
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

}
