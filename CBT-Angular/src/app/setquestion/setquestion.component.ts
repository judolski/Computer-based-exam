import { Component, Inject, OnInit,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Question } from '../model/setquestion';
import { QuestionService } from '../services/question.service';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { UserIdleService } from 'angular-user-idle';


@Component({
  selector: 'app-setquestion',
  templateUrl: './setquestion.component.html',
  styleUrls: ['./setquestion.component.scss']
})
export class SetquestionComponent implements OnInit {
  questionForm: Question | any;
  successMsg:any;
  errorMsg: any;
  requiredField!: string | null;
  checkUser!: string | null;
  sessionTimeOutErr!: string | null;
  showActionErr = "none";
  errMsgDialog = "none";
  succMsgDialog = "none";
  spinning = "none";
  overlay = "none";
  @ViewChild('qForm') questionFormDirective:any;
  

  constructor(private questionService:QuestionService, private adminService:AdminService, 
    private authService: AuthService, private idelService:UserIdleService, private router:Router,
    @Inject('BaseURL') public BaseURL:any) { 
    this.createForm();
  }

  ngOnInit(): void {
    let token = sessionStorage.getItem('token');
    if (!token) {
      return this.homepage();
    }
    this.checkUser = sessionStorage.getItem('checkUser');
    this.checkIdleUser();
  }


  checkIdleUser() {
    //checking for user inactivity
    this.idelService.startWatching();
    //start watching if user is inactive
    this.idelService.onTimerStart().subscribe(count => console.log('logging you out'));
    //checking when time is up
    this.idelService.onTimeout().subscribe(() => { 
      this.showActionErr = "block";
      this.sessionTimeOutErr = "User session timed out";
      this.overlay = "block";
      this.authService.logout("token", "checkUser");
      this.idelService.stopWatching()
      this.idelService.resetTimer();
    });
  }

  sessionTimedOut() {
    window.location.reload();
    this.authService.logout("token", "checkUser");
  }

  get f() {
    return this.questionForm.controls;
  }
    
  createForm() {
    this.questionForm = new FormGroup ({
      num: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      question: new FormControl("", [Validators.required, Validators.pattern("^\\S{1}.+\\S{1}$")]),
      option1: new FormControl("", [Validators.required]),
      option2: new FormControl("", [Validators.required]),
      option3: new FormControl("", [Validators.required]),
      option4: new FormControl("", [Validators.required]),
      corr_ans: new FormControl("", [Validators.required]),
      ans1: new FormControl("", [Validators.required]),
      ans2: new FormControl("", [Validators.required]),
      ans3: new FormControl("", [Validators.required]),
      ans4: new FormControl("", [Validators.required])
    });
  }

  addQuestion() {
    if (this.questionForm.valid) {
      this.showSpinner();
      let formValue = this.questionForm.value;
      this.questionService.addQuestion(formValue).subscribe((data) => {
        if(data) {
          this.hideSpinner();
          this.succcessPopup();
          this.questionFormDirective.resetForm();
        }
      }, (err) => {
          this.hideSpinner();
          this.errorPopup(err);
      });
    }
    else {
      this.requiredField = "Fill all the required field.";
      setTimeout(() => {
        this.requiredField = null;
      },5000)

    }
  }

  homepage() {
    this.router.navigate(['/admin-section']);
  }

  logout() {
    this.authService.logout("token", "checkUser");
    this.router.navigate(['admin-section'])
  }

  errorPopup(err:string) {
    this.successMsg = "none";
    this.errorMsg = this.authService.catchAuthError(err);
    this.errMsgDialog = "block";
    this.overlay = "block";
  }

  succcessPopup() {
    this.errorMsg = "none";
    this.successMsg = " Question successfully added";
    this.succMsgDialog = "block";
    this.overlay = "block";
  }

  closeErrorPopup() {
    this.errMsgDialog = "none";
    this.overlay = "none";
  }
  closeSuccessPopup() {
    this.succMsgDialog = "none";
    this.overlay = "none";
  }

  showSpinner() {
    this.spinning = "block";
  }
  hideSpinner() {
    this.spinning = "none";
  }




}
