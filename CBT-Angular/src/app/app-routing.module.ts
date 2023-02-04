import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { QuestionsComponent } from './questions/questions.component';
import { SetquestionComponent } from './setquestion/setquestion.component';
import { AdminSectionComponent } from './admin-section/admin-section.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: 'signup', component:   SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'questions', component: QuestionsComponent},
  {path: 'setquestion', component: SetquestionComponent},
  {path: 'admin-section', component: AdminSectionComponent, canActivate: [AuthGuardService]},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: '', redirectTo:   '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
