import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDiscussComponent } from './group-discuss.component';

describe('GroupDiscussComponent', () => {
  let component: GroupDiscussComponent;
  let fixture: ComponentFixture<GroupDiscussComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDiscussComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDiscussComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
