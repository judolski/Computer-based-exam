import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewUser } from '../model/signupModel';
import { Gender } from '../model/signupModel';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})
export class ModifyUserComponent implements OnInit {

  userForm: NewUser | any;
  successMsg:any;
  genderType = Gender;
  errorMsg: any;
  user: NewUser | any;
  spinning = "none";

  constructor(private router:Router,
    private adminService: AdminService,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public user_id:any) {
      this.createForm();
     }

  ngOnInit(): void {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return this.homepage();
    } 
    else {
      let option = {queryField: '_id', value: this.user_id.id}
      this.adminService.getUser(JSON.stringify(option)).subscribe((user) => {
        this.user = user;
        this.setFormValue();
      })
    }
  }

  createForm() {
    this.userForm = new FormGroup({
      firstname: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z]*'), Validators.minLength(2)]),
      lastname: new FormControl("", [Validators.required,Validators.pattern('[a-zA-Z]*'), Validators.minLength(2)]),
      middlename: new FormControl("", Validators.pattern('[a-zA-Z]*')),
      gender: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(10)]),
      email: new FormControl("", [Validators.required, Validators.email])
    });
  }

  get f() {
    return this.userForm.controls;
  }

  setFormValue() {
    let data = {
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      middlename: this.user.middlename,
      gender: this.user.gender,
      phone: this.user.phone,
      email: this.user.email
    }
    this.userForm.setValue(data);
  }

  modifyUser() {
    if (this.userForm.valid) {
      this.showSpinner();
      let option = {formValue:this.userForm.value, dataToUpdate: this.user._id};
      this.adminService.updateData(option, "admin/users/user").subscribe((data) => {
        if(data) {
          this.hideSpinner();
          this.errorMsg = null;
          this.successMsg = " User details successfully updated";
        }
      }, (err) => {
          this.hideSpinner();
          this.successMsg = null;
          this.errorMsg = this.authService.catchAuthError(err);
      });
    }
  }


  homepage() {
    this.router.navigate(['/adminSection']);
  }
  
  showSpinner() {
    this.spinning = "block";
  }
  hideSpinner() {
    this.spinning = "none";
  }
  
}
