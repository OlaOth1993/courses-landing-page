import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesAsTeacherComponent } from './resources-as-teacher.component';

describe('ResourcesAsTeacherComponent', () => {
  let component: ResourcesAsTeacherComponent;
  let fixture: ComponentFixture<ResourcesAsTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesAsTeacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesAsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
