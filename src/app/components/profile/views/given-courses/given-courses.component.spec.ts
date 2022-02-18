import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivenCoursesComponent } from './given-courses.component';

describe('GivenCoursesComponent', () => {
  let component: GivenCoursesComponent;
  let fixture: ComponentFixture<GivenCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GivenCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GivenCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
