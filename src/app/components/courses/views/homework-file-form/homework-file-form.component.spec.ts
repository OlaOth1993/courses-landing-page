import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkFileFormComponent } from './homework-file-form.component';

describe('HomeworkFileFormComponent', () => {
  let component: HomeworkFileFormComponent;
  let fixture: ComponentFixture<HomeworkFileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeworkFileFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkFileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
