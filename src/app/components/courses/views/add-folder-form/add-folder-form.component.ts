import { IFolder } from './../../../../entities/abstract-entities/folder';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../courses.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-folder-form',
  templateUrl: './add-folder-form.component.html',
  styleUrls: ['./add-folder-form.component.scss']
})
export class AddFolderFormComponent implements OnInit {
  @Input() modalRef: NgbModalRef;
  @Input() courseId : number;
  @Input() list : IFolder [];
  @Input() folderID: number;
  folder: IFolder;
  addfolder: FormGroup;
  //index: number;
  @Output() newExEvent = new EventEmitter<IFolder[]>();

  constructor( private fb: FormBuilder,
              private coursesService: CoursesService
    )
     {
   
      this.addfolder = this.fb.group({
      name : new FormControl(),
      course_id: new FormControl(),
      folder_id:new FormControl()
    });
    
    }

  ngOnInit(): void {
    console.log("folder_ID: " , this.folderID)
  }
  addFolder(data: any){
    this.addfolder.patchValue({
      course_id: this.courseId
    });
   // data.value.course_id = this.courseId;
    console.log('data.value', data.value);

    this.coursesService.addFolder(data.value).subscribe(
      (response: any) => {

       // this.list[this.index].name = data.value.name;
       this.folder =response.data;
       this.list.splice(0,0,this.folder);
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
  addFolderInsideFolder(data:any){
    this.addfolder.patchValue({
      course_id: this.courseId,
      folder_id: this.folderID
    });
   // data.value.course_id = this.courseId;
    console.log('data.value', data.value);

    this.coursesService.addFolder(data.value).subscribe(
      (response: any) => {

       // this.list[this.index].name = data.value.name;
       this.folder =response.data;
       this.list.splice(0,0,this.folder);
          this.newExEvent.emit(this.list);
        this.modalRef.close();
        console.log('respoooonse', response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
}
