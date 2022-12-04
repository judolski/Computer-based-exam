import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Question } from '../model/setquestion';
import { QuestionService } from '../services/question.service';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-setquestion',
  templateUrl: './setquestion.component.html',
  styleUrls: ['./setquestion.component.scss']
})
export class SetquestionComponent implements OnInit {
  questionForm: Question | any;
  successMsg:any;
  errorMsg: any;
  errMsg = "none";
  succMsg = "none";
  spinning = "none";
  overlay = "none";


  constructor(private questionService:QuestionService, private authServive: AuthService, 
    @Inject('BaseURL') public BaseURL:any) { 
    this.createForm();
  }

  ngOnInit(): void {
  }

    
  createForm() {
    this.questionForm = new FormGroup ({
      num: new FormControl(""),
      question: new FormControl(""),
      option1: new FormControl(""),
      option2: new FormControl(""),
      option3: new FormControl(""),
      option4: new FormControl(""),
      corr_ans: new FormControl(""),
      ans1: new FormControl(""),
      ans2: new FormControl(""),
      ans3: new FormControl(""),
      ans4: new FormControl("")
    });
  }

  addQuestion() {
    if (this.questionForm.valid) {
      this.showSpinner();
      let formValue = this.questionForm.value;
      this.questionService.addQuestion(formValue).subscribe((data) => {
        if(data) {
          this.hideSpinner();
          this.errorMsg = "none";
          this.successMsg = " Question successfully added";
          this.succcessPopup();
        }
      }, (err) => {
          this.hideSpinner();
          this.successMsg = "none";
          this.errorMsg = this.authServive.catchAuthError(err);
          this.errorPopup();
      });
    }
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
  }

  showSpinner() {
    this.spinning = "block";
  }
  hideSpinner() {
    this.spinning = "none";
  }




}
