import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Question } from '../model/setquestion';
import { QuestionService } from '../services/question.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

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
  showScore:any = false;
  userSession: any;

  currentQuestion: String|any;
  questionIndex: number = 0;
  totalAnswered: number = 0;
  rightAnswer: number|any;
  scoreSavedStutus: any;

  display = "none";
  spinning = "none";
  overlayValue = "none";
  savedScoreColour = "black"
  timerColor = "green";

  constructor(
    private questionService: QuestionService, 
    private authservice:AuthService, 
    private userService: UserService,
    private route: ActivatedRoute, 
    private router: Router,
    @Inject('BaseURL') public BaseURL:any) { }


  
  ngOnInit(): void { 
    this.userSession = {session: sessionStorage.getItem('user')};
    
    this.questionService.getquestions(this.userSession).subscribe((questions) => {
      if (questions) {
        this.questions = questions;
        this.examDuration(1/2)
      }
    }, err => {
      this.errMess = <any> err.error.message; 
      //alert(err.message);
      this.router.navigate(['/login']);
    });
  
  }

  
  resetQuiz() {
    for (let i = 0; i < this.questions.length; i++) {
      if ("selected" in this.questions[i]) {
        delete this.questions[i]["selected"];
      }
    }
  }


  hrs:any;
  mins:any;
  secs:any;
  myFunc:any;
  
  examDuration(duration:any) {
    let countdownDate = new Date().getTime() + duration * 60 * 1000;
    let currentDate = new Date().getTime();
    let previousSavedTime = Number(localStorage.getItem(JSON.stringify(sessionStorage.getItem('user'))));
    let prevTime = previousSavedTime + currentDate;

    //check if there already a saved countdown process for the user
    if (previousSavedTime){
      let myFunc = setInterval(() => {
        let now = new Date().getTime();
        
        let timeLeft = prevTime - now;
  
        this.hrs = Math.floor((timeLeft % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
        this.mins = Math.floor((timeLeft % (1000 * 60 * 60))/(1000 * 60));
        this.secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (this.hrs != 0 || this.mins != 0 || this.secs != 0) {
          localStorage.setItem(JSON.stringify(sessionStorage.getItem('user')), JSON.stringify(timeLeft));
        }
  
        if (this.mins <= 10) {
          this.timerColor = "red";
        }

        if (this.hrs == 0 && this.mins == 0 && this.secs == 0) {
          //clear countdowndown
          localStorage.removeItem(JSON.stringify(sessionStorage.getItem('user')));
          clearInterval(myFunc);
          this.calculate();
        }
  
      }, 100)

    }
    else {
      let myFunc = setInterval(() => {
        let now = new Date().getTime();
        
        let timeLeft = countdownDate - now;
  
        this.hrs = Math.floor((timeLeft % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
        this.mins = Math.floor((timeLeft % (1000 * 60 * 60))/(1000 * 60));
        this.secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (this.hrs != 0 || this.mins != 0 || this.secs != 0) {
          localStorage.setItem(JSON.stringify(sessionStorage.getItem('user')), JSON.stringify(timeLeft));
        }

        if (this.mins <= 10) {
          this.timerColor = "red";
        }

        if (this.hrs == 0 && this.mins == 0 && this.secs == 0) {
          //clear countdowndown
          localStorage.removeItem(JSON.stringify(sessionStorage.getItem('user')));
          clearInterval(myFunc);
          this.calculate();
        }
  
      }, 100)

    }
  }


  clearCountdown() {
    clearInterval(this.myFunc)
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
    this.saveScore();
    }

  saveScore() {
    if (this.userSession) {
      let option = {session: sessionStorage.getItem('user'), score: this.rightAnswer}
      this.userService.updateUser(option).subscribe((result) => {
        this.savedScoreColour = "darkgreen"
        this.showScore = true;
        this.scoreSavedStutus = result.message;
      }, (err) => {
        this.savedScoreColour = "maroon"
        this.scoreSavedStutus = <any> err.error.message; 
      });
      this.scoreModal();
      this.authservice.logout();
    }
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

  scoreModal() {
    this.display = "block";
    this.overlayValue = "block";
  }

  closescoreModal() {
    this.display = "none";
    this.overlayValue = "none";
    this.router.navigate(['/login']);
  }

}
