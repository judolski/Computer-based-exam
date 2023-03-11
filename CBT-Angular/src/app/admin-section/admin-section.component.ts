import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserIdleService } from 'angular-user-idle';
import { NewUser } from '../model/signupModel';
import { Question } from '../model/setquestion';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { ModifyQuestionComponent } from '../modify-question/modify-question.component';
import { ModifyUserComponent } from '../modify-user/modify-user.component';


@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.scss']
})
export class AdminSectionComponent implements OnInit {
  adminLoginForm!: FormGroup;
  users:NewUser | any;
  questions: Question | any;
  user_id:any;
  question_id:any;
  userNotFound!:string | null;
  checkUser:  any;
  showConfirmDelete = "none";
  showQuestionDelete = "none";
  overlay = "none";
  deleteOverlay ="none";
  displayModal = "none";
  spinning = "none";
  loadingUser = "none";
  loadingQuestion = "none";
  showLoginBtn = "block";
  recordModal = "none";
  questionModal = "none";
  showActionErr = "none";

  errMess: any;
  serverErr: any;

  eyeToggle = "fa fa-eye";
  password!: string;
  passInputTtype = "password";

  searchField = ["Phone", "Email"];
  search!: string | null;
  highlightText = "yellow"
  option = null;
  noSearchRocord!:string | null;
  selectedSearchField:any;
  searchUser: any;
  searchResult:any;
  token: string|any;
  sessionTimeOutErr!: string | null;


  constructor(private adminService:AdminService,
    public authService: AuthService, private idleService:UserIdleService,
    @Inject('BaseURL') public BaseURL:any,
    private router: Router,
    public dialog:MatDialog) { 
      this.createForm();
    }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.loginModal();
    }
    else {
      this.checkUser = sessionStorage.getItem('checkUser');
      this.checkIdleUser();
    }
  }

  checkIdleUser() {
    //checking for user inactivity
    this.idleService.startWatching();
      //refreshes the token every n seconds if not idle
      let refresh = setInterval(() => {
        this.adminService.refreshToken(this.checkUser).subscribe((newToken) => {
          sessionStorage.setItem('token',newToken.token);
        }, (err) => {
          this.idleService.stopWatching();
          this.idleService.stopTimer();
          clearInterval(refresh);
        });
      }, 300000);

    //start watching if user is inactive
    this.idleService.onTimerStart().subscribe(count => {
      console.log('logging you out');
      clearInterval(refresh);
    });
    //checking when time is up
    this.idleService.onTimeout().subscribe(() => { 
      this.showActionErr = "block";
      this.sessionTimeOutErr = "User session timed out";
      this.overlay = "block";
      this.authService.logout("token", "checkUser");
      this.idleService.stopWatching();
      this.idleService.stopTimer();
      clearInterval(refresh);
    });
  }

  sessionTimedOut() {
    window.location.reload();
    this.authService.logout("token", "checkUser");
  }

  createForm() {
    this.adminLoginForm = new FormGroup({
      username: new FormControl("",[ Validators.required]),
      password: new FormControl("",[Validators.required])
    });
    this.adminLoginForm.valueChanges.subscribe((data:any) => { this.formValidation(data) });
    this.formValidation();
  }

  formErrors: FormGroup | any = {
      'username': '',
      'password': ''
  };

  formErrormsgs: any = {
    'username': {
      'required': 'Enter your Email.'
    },
    'password': {
      'required': 'Enter your password.'
    }
  };

  formValidation (data?: any) {
    if(!this.adminLoginForm){return;}
    const form = this.adminLoginForm;
    for(const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)) {
        // clears all errors
        this.formErrors[field] = '';
        this.errMess = '';
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

  Adminlogin() {
    if (this.adminLoginForm.valid) {
      this.showSpinner();
      const formData = this.adminLoginForm.value;
      this.adminService.adminLogin(formData).subscribe((adminUser) => {
        if (adminUser) {
          const jwt = adminUser.token;
          const jwtPayLoad = JSON.parse(window.atob(jwt.split('.')[1]))
          let exp = jwtPayLoad.exp;
          let now = Math.floor((new Date().getTime())/1000);
          sessionStorage.setItem('token',adminUser.token);
          sessionStorage.setItem('checkUser', adminUser.username);
          this.checkUser = adminUser.username;
          this.hideLoginModal();
          this.checkIdleUser();
        }
      }, (err) => {
        this.hideSpinner();
        setTimeout(() => {
          this.errMess = null;
        }, 5000);
        this.errMess = this.authService.catchAuthError(err);
      });
    }
  }

  getUsers() {
    this.adminService.getUsers().subscribe((users) => {
      if(users != '' || null) {
        this.users = users;
      }
      else {
        this.userNotFound = "No record found";
      }
    }, (err) => {
        this.serverErr = this.authService.catchAuthError(err);
      });
  }

  getQuestions() {
    this.adminService.getQuestions().subscribe((questions) => {
      if(questions != '' || null) {
        this.questions = questions;
      }
      else {
        this.userNotFound = "No record found";
      }
    }, (err) => {
      this.serverErr = this.authService.catchAuthError(err);;
    })
  }

  retakeTest(userId?:any) {
    this.adminService.removeScore(userId).subscribe((result) => {
      
        this.ShowUserRecord();
      
    }, (err) => {
      this.showActionErr = "block";
      this.serverErr = this.authService.catchAuthError(err);
      setTimeout(() => {
        this.showActionErr = "none";
        this.serverErr = null;
      }, 5000);
    })
  }

  modifyQuestionComponent(question_id:string) {
    this.questionModal = "none";
    this.overlay = "none";
    const dialogRef = this.dialog.open(ModifyQuestionComponent, {
      height: '75%',
      data: {id: question_id}
    }).afterClosed().subscribe(close => {
        this.ShowQuestionRecord();
    })
  }

  modifyUserComponent(user_id:string) {
    this.recordModal = "none";
    this.overlay = "none";
    const dialogRef = this.dialog.open(ModifyUserComponent, {
      height: '75%',
      width: '60%',
      data: {id: user_id},
    }).afterClosed().subscribe((close) => {
      if (this.searchUser) {
        //this.showSearchRecord();
      }
      else if(this.users) {
        this.ShowUserRecord();
      }
    })
  }

  deleteUser(userId:any) {
    this.closeModal();
    this.adminService.deleteUser(userId).subscribe((result) => {
      if (result) {
        if (this.searchUser) {
          //this.showSearchRecord();
        }
        else if(this.users) {
          this.ShowUserRecord();
        }
      }
    }, (err) => {
      this.showActionErr = "block";
      this.serverErr = this.authService.catchAuthError(err);
      setTimeout(() => {
        this.showActionErr = "none";
        this.serverErr = null;
      }, 5000);
    });
  }

  deletequestion(questionId:any) {
    this.closeModal();
    this.adminService.deleteQuestion(questionId).subscribe((result) => {
      if (result) {
        this.ShowQuestionRecord();
      }
    }, (err) => {
      this.showActionErr = "block";
      this.serverErr = this.authService.catchAuthError(err);
      setTimeout(() => {
        this.showActionErr = "none";
        this.serverErr = null;
      }, 5000);
    });
  }

  searchRecord() {
    let field = this.selectedSearchField.toLowerCase();
    this.searchResult = this.users.filter((user:any) => user[field].includes(this.search));
    if(this.searchResult == "") {
      this.noSearchRocord = "No record found"
    }
  }

  confirmDelete(userId:any) {
      this.showConfirmDelete = "block";
      this.deleteOverlay = "block";
      this.user_id = userId;
  }

  confirmQuestionDelete(questionId:any) {
    this.showQuestionDelete = "block";
    this.deleteOverlay = "block";
    this.question_id = questionId;
}

  closeModal() {
    this.showConfirmDelete = "none";
    this.showQuestionDelete = "none";
    this.deleteOverlay = "none";
    this.user_id = "";
    this.question_id = "";
  }

  eyeToggleIcon() {
    if(this.eyeToggle == "fa fa-eye") {
      this.eyeToggle = "fa fa-eye-slash";
        this.passInputTtype = "text";
    }
    else if(this.eyeToggle == "fa fa-eye-slash") {
        this.eyeToggle = "fa fa-eye";
        this.passInputTtype = "password";
    }
  }

  loginModal() {
    this.displayModal = "block";
    this.overlay = "block";
  }

  hideLoginModal() {
    this.displayModal = "none";
    this.overlay = "none";
  }

  logout() {
    window.location.reload();
    this.authService.logout("token", "checkUser");
  }

  ShowUserRecord() {
    this.loadingUser = "block";
    this.overlay = "block";
    this.getUsers();
    this.recordModal = "block"; 
  }

  hideUserRecord() {
    this.recordModal = "none";
    this.overlay = "none";
    window.location.reload();

  }

  ShowQuestionRecord() {
    this.overlay = "block";
    this.loadingQuestion = "block";
    this.getQuestions();
    this.questionModal = "block"; 
  }

  hideQuestionRecord() {
    this.questionModal = "none";
    this.overlay = "none";
    window.location.reload();
  }

  showSpinner() {
    this.spinning = "block";
    this.showLoginBtn = "none";
  }

  hideSpinner() {
    this.spinning = "none";
    this.showLoginBtn = "block";
  }


}
