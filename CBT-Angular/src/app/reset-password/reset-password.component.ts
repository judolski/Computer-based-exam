import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  passwordResetForm: any;
  errMess: any;
  succMess: any;
  spinning: string = "none";
  showBtn: string = "block";

  constructor(private userService:UserService, private authService:AuthService) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm() {
    this.passwordResetForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email])
    });
  }
  
  submit() {
    if(this.passwordResetForm.valid) {
      this.showSpinner();
      let formValue = {email: this.passwordResetForm.value.email};
      this.userService.resetPassword(formValue).subscribe((result) => {
        if(result) {
          this.hideSpinner();
          this.succMess = result.message;
          this.errMess = null;
        }
      }, (err) => {
        this.hideSpinner();
        this.succMess = null;
        this.errMess = this.authService.catchAuthError(err);
      });
    }
  }

  showSpinner() {
    this.spinning = "block";
    this.showBtn = "none";
  }

  hideSpinner() {
    this.spinning = "none";
    this.showBtn = "block";
  }

}
