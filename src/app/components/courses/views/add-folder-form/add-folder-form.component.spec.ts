import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFolderFormComponent } from './add-folder-form.component';

describe('AddFolderFormComponent', () => {
  let component: AddFolderFormComponent;
  let fixture: ComponentFixture<AddFolderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFolderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFolderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
