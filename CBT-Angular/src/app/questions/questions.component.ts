import { Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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

  checkUser: any;

  questions: Question[]|any
  errMess: any;
  ansArr: any;
  showScore:any = false;
  userSession: any;
  navEvent:any;

  hrs:any;
  mins:any;
  secs:any;
  myFunc:any;
  currentQuestion: String|any;
  questionIndex: number = 0;
  totalAnswered: number = 0;
  rightAnswer: number|any;
  scoreSavedStutus: any;

  display = "none";
  displaySubmit = "none";
  spinning = "none";
  overlayValue = "none";
  overlayColor = "none";
  savedScoreColour = "black";
  timerColor = "green";

  constructor(
    private questionService: QuestionService, 
    private authservice:AuthService, 
    private userService: UserService,
    private route: ActivatedRoute, 
    private router: Router,
    @Inject('BaseURL') public BaseURL:any) {
      
     }

  ngOnInit(): void {
    this.userSession = {session: sessionStorage.getItem('user')};
    if (localStorage.getItem('score') == null) {
      this.questionService.getquestions(this.userSession).subscribe((questions) => {
        if (questions) {
          this.questions = questions;
          this.examDuration(1)
        }
      }, err => {
        this.errMess = <any> err.error.message;
        this.router.navigate(['/login']);
      });
    }
    else {
      this.router.navigate(['/login']);
    }

    this.userService.getUser(this.userSession).subscribe((user) => {
      this.checkUser = user.firstname;
    })
  }
  
  ngDoCheck(): void {
    this.currentQuestion = this.questions[this.questionIndex];
  }
  
  examDuration(duration:any) {
    let countdownDate = new Date().getTime() + duration * 60 * 1000;    
    this.checkReload();

    this.myFunc = setInterval(() => {
      let now = new Date().getTime();
      
      let timeLeft = countdownDate - now;

      this.hrs = Math.floor((timeLeft % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
      this.mins = Math.floor((timeLeft % (1000 * 60 * 60))/(1000 * 60));
      this.secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (this.mins <= 10) {
        this.timerColor = "red";
      }

      if (timeLeft <= 0) {
        this.calculate();
      }

    }, 0)
  }

  
  
  calculate() {
    this.closeSubmitModal();
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
      let option = {session: sessionStorage.getItem('user'), value: this.rightAnswer, fieldToUpdate: "score"}
      this.userService.updateUser(option).subscribe((result) => {
        localStorage.removeItem('score');
        this.showScore = true;
        this.authservice.logout('user');
        if(this.rightAnswer >= 0.8*Number(this.questions.length)) {
          this.scoreSavedStutus = "You passed!!";
          this.savedScoreColour = "darkgreen";
        }
        if(this.rightAnswer < 0.8*Number(this.questions.length)) {
          this.scoreSavedStutus = "Ouch, You failed";
          this.savedScoreColour = "maroon";
        }
      }, (err) => {
        this.savedScoreColour = "maroon";
        this.scoreSavedStutus = <any> err.error.message; 
      });
      this.scoreModal();
      clearInterval(this.myFunc);        
    }
  }

  checkReload() {
    window.addEventListener('beforeunload', (e) => {
      return this.calculate();
    })
  }

  goPrevious() {
    if (this.questionIndex > 0) {
    this.questionIndex--;
    }
  }

  goNext() {
    if (this.questionIndex+1 < this.questions.length) {
      this.questionIndex++;
    }
  }

  scoreModal() {
    this.display = "block";
    this.overlayValue = "block";
  }

  closescoreModal() {
    window.close();
    this.display = "none";
    this.overlayValue = "none";
  }

  submitConfirmationModal() {
    this.displaySubmit = "block";
    this.overlayValue = "block";
  }

  closeSubmitModal() {
    this.displaySubmit = "none";
    this.overlayValue = "none";
  }

  showSpinner() {
    this.spinning = "block";
  }
  hideSpinner() {
    this.spinning = "none";
  }

}
