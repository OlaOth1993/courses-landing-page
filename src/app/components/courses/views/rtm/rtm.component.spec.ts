import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTMComponent } from './rtm.component';

describe('RTMComponent', () => {
  let component: RTMComponent;
  let fixture: ComponentFixture<RTMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RTMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RTMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
