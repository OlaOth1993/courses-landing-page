import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFolderFormComponent } from './rename-folder-form.component';

describe('RenameFolderFormComponent', () => {
  let component: RenameFolderFormComponent;
  let fixture: ComponentFixture<RenameFolderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenameFolderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameFolderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
