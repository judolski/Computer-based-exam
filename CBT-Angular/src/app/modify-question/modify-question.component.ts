import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Question } from '../model/setquestion';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-modify-question',
  templateUrl: './modify-question.component.html',
  styleUrls: ['./modify-question.component.scss']
})
export class ModifyQuestionComponent implements OnInit {

  questionForm: Question | any;
  successMsg:any;
  errorMsg: any;
  requiredField!: string | null;
  question: Question | any;
  spinning = "none";

  constructor(private router:Router, 
    private adminService:AdminService, 
    private authService:AuthService,
    @Inject('BaseURL') public BaseURL:any,
    @Inject(MAT_DIALOG_DATA) public question_id: any) { 
      this.createForm();
    }

  ngOnInit(): void {
    sessionStorage.removeItem('adminUser')
    let token = sessionStorage.getItem('token');
    if (!token) {
      return this.homepage();
    } 
    else {
      this.adminService.getquestion(this.question_id.id).subscribe((question) => {
        this.question = question;
        this.setFormValue();
      })
    }
  }

  createForm() {
    this.questionForm = new FormGroup ({
      num: new FormControl("", [Validators.required]),
      question: new FormControl("", [Validators.required]),
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

  setFormValue() {
    let data = {
      num: this.question.num,
      question: this.question.question,
      option1: this.question.option1,
      option2: this.question.option2,
      option3: this.question.option3,
      option4: this.question.option4,
      corr_ans: this.question.corr_ans,
      ans1: this.question.ans1,
      ans2: this.question.ans2,
      ans3:this.question.ans3,
      ans4: this.question.ans4
    }
    this.questionForm.setValue(data)
  }

  modifyQuestion() {
    if (this.questionForm.valid) {
      this.showSpinner();
      let option = {formValue:this.questionForm.value, dataToUpdate: this.question._id};
      this.adminService.updateData(option, "admin/questions/question").subscribe((data) => {
        if(data) {
          this.hideSpinner();
          this.errorMsg = null;
          this.requiredField = null;
          this.successMsg = " Question "+this.question.num+" successfully updated";
        }
      }, (err) => {
          this.hideSpinner();
          this.successMsg = null;
          this.requiredField = null;
          this.errorMsg = this.authService.catchAuthError(err);
      });
    }
    else {
      this.successMsg = null;
      this.errorMsg = null;
      this.requiredField = "Fill all the required field.";
      setTimeout(() => {
        this.requiredField = null;
      },5000)

    }
  }

  homepage() {
    this.router.navigate(['/admin-section']);
  }


  showSpinner() {
    this.spinning = "block";
  }
  hideSpinner() {
    this.spinning = "none";
  }
  
}
