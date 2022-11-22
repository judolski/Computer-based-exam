import { Component, Inject, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Question } from '../model/setquestion';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  question: Question|any;
  questions: Question[]|any
  errMess: any;
  ansArr: any;

  currentQuestion: String|any;
  questionIndex: number = 0;
  totalAnswered: number = 0;
  rightAnswer!: number;
  

  constructor(private questionService: QuestionService,
    private route: ActivatedRoute,
    @Inject('BaseURL') public BaseURL:any) { }

  ngOnInit(): void { 
    this.questionService.getquestions().subscribe((questions) => {
      this.questions = questions;
    }, err => this.errMess = <any> err);
  
  }


  resetQuiz() {
    for (let i = 0; i < this.questions.length; i++) {
      if ("selected" in this.questions[i]) {
        delete this.questions[i]["selected"];
      }
    }
  }

  
  calculate() {
    this.rightAnswer = 0;
    this.totalAnswered = 0;
    this.ansArr = [];
    for(let i = 0; i < this.questions.length; i++) {
      if("selected" in this.questions[i] && (this.questions[i]["selected"] != null)) {
        this.totalAnswered++;
        this.ansArr.push(i+1+' '+this.questions[i]["selected"]);  
        if(this.questions[i]["selected"] == this.questions[i]["corr_ans"]) {
          this.rightAnswer++;
        }
        
      }
    }
    alert(this.rightAnswer);
    alert(this.ansArr);
    }


  ngDoCheck(): void {
    this.currentQuestion = this.questions[this.questionIndex];
  }

  goPrevious() {
    if (this.questionIndex > 0) {
    this.questionIndex--
    }
  }

  goNext() {
    if (this.questionIndex+1 < this.questions.length) {
      this.questionIndex++
    }
  }

}
