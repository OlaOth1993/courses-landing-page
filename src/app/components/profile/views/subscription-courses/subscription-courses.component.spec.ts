import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionCoursesComponent } from './subscription-courses.component';

describe('SubscriptionCoursesComponent', () => {
  let component: SubscriptionCoursesComponent;
  let fixture: ComponentFixture<SubscriptionCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
