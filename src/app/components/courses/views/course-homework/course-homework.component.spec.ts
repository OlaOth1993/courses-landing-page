import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseHomeworkComponent } from './course-homework.component';

describe('CourseHomeworkComponent', () => {
  let component: CourseHomeworkComponent;
  let fixture: ComponentFixture<CourseHomeworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseHomeworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseHomeworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
