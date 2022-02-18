import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonCourseCardComponent } from './skeleton-course-card.component';

describe('SkeletonCourseCardComponent', () => {
  let component: SkeletonCourseCardComponent;
  let fixture: ComponentFixture<SkeletonCourseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkeletonCourseCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonCourseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
