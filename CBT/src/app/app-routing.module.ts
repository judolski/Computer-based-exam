import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { QuestionsComponent } from './questions/questions.component';
import { SetquestionComponent } from './setquestion/setquestion.component';

const routes: Routes = [
  {path: 'signup', component:   SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'questions', component: QuestionsComponent},
  {path: 'questions/:id', component: QuestionsComponent},
  {path: 'setquestion', component: SetquestionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
