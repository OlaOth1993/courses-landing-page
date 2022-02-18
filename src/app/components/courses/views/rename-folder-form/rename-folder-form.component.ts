import { IFolder } from './../../../../entities/abstract-entities/folder';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../courses.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-rename-folder-form',
  templateUrl: './rename-folder-form.component.html',
  styleUrls: ['./rename-folder-form.component.scss']
})
export class RenameFolderFormComponent implements OnInit {
  @Input() modalRef: NgbModalRef;
  @Input()  folderObj : IFolder;
  @Input() list : IFolder [];
  renameFolder: FormGroup;
  index: number;
  @Output() newExEvent = new EventEmitter<IFolder[]>();

  constructor( private fb: FormBuilder,
    private coursesService: CoursesService) {
    this.renameFolder = this.fb.group({
      name : new FormControl(),
      id: new FormControl(),
    });
   }
 
  ngOnInit(): void {
    this.patchValueName();
    console.log("this.folderObj",this.folderObj);
    this.index = this.list.findIndex(x => x.id === this.folderObj.id);
  }
  patchValueName(){
    this.renameFolder.patchValue({
      name : this.folderObj.name,
      id : this.folderObj.id
    }
    );
    console.log("this.renameFolder",this.renameFolder.value)

  }
  updateFolder(data: any){
    console.log("data", data.value)
   /*  this.renameFolder.patchValue({
      id: this.folderObj.id
    }); */
    this.coursesService.renameFolder(data.value).subscribe(
      (response: any) => {

        this.list[this.index].name = data.value.name;
          this.newExEvent.emit(this.list);
        this.modalRef.close();
        console.log('respoooonse', response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  hide(){
    this.modalRef.close();
  }
}
