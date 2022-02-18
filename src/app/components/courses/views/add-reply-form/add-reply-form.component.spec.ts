import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReplyFormComponent } from './add-reply-form.component';

describe('AddReplyFormComponent', () => {
  let component: AddReplyFormComponent;
  let fixture: ComponentFixture<AddReplyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReplyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
