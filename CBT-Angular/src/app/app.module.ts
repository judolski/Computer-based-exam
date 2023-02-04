import * as core from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule} from '@angular/material/icon';
import { MatSidenavModule} from '@angular/material/sidenav'; 
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { UserIdleModule } from 'angular-user-idle';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { QuestionsComponent } from './questions/questions.component';
import { SetquestionComponent } from './setquestion/setquestion.component';
import { AdminSectionComponent } from './admin-section/admin-section.component';

import { UserService } from './services/user.service';
import { QuestionService } from './services/question.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AdminService } from './services/admin.service';

import { baseURL } from './share/baseurl';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { ModifyQuestionComponent } from './modify-question/modify-question.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@core.NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    QuestionsComponent,
    SetquestionComponent,
    AdminSectionComponent,
    HeaderComponent,
    FooterComponent,
    ModifyUserComponent,
    ModifyQuestionComponent,
    ResetPasswordComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatIconModule,
    MatSidenavModule,
    MatRadioModule,
    MatTooltipModule,
    HttpClientModule,
    UserIdleModule.forRoot({idle: 120, timeout:6, ping: 2})
  ],
  providers: [
    UserService,
    QuestionService,
    AdminService,
    {provide: 'BaseURL', useValue:baseURL},
   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  entryComponents: [
    ModifyQuestionComponent,
    ModifyUserComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
