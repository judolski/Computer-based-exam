import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetquestionComponent } from './setquestion.component';

describe('SetquestionComponent', () => {
  let component: SetquestionComponent;
  let fixture: ComponentFixture<SetquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetquestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
