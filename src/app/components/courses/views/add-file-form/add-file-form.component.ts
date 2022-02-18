import { IResource } from './../../../../entities/abstract-entities/resource';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { IFolder } from 'src/app/entities/abstract-entities/folder';
import { CoursesService } from '../../courses.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-file-form',
  templateUrl: './add-file-form.component.html',
  styleUrls: ['./add-file-form.component.scss']
})
export class AddFileFormComponent implements OnInit {
  fileUpload: string;
  fileURL: string;
  name: string;
  file: IResource;
  fileRes: IResource;
  extention: string;
  loading: boolean;
  isHide: boolean;
  @Input() modalRef: NgbModalRef;
  @Input() resourceList : IResource [];
  @Input() folderId : number;
  @Output() newExEvent = new EventEmitter<IResource[]>();

  constructor( private _coursesService: CoursesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _toastService: ToastService,
    
    ) {
      this.loading = false;
     // this.isHide = false;
     }

  ngOnInit(): void {
    console.log("this.resourceList",this.resourceList, "this.folderId",this.folderId);
    this.file = new IResource();
  }
  public dropped(files: NgxFileDropEntry[]) {
  //  this.files = files;
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(file);


          this.fileUpload = droppedFile.relativePath;
          const formData = new FormData();
       //   console.log("id",id)
          formData.append("file",file, this.fileUpload);
          this._coursesService.uploadFile(formData).subscribe((response: any) => {
            console.log(response);

            this.fileURL = response.data.url;
            console.log("this.fileURL",this.fileURL)
          //  if(response.status= "OK")
           // this.uploadSolution(id)
          });

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  public fileOver(event){
    //console.log('fileover', event);
   }
 
   public fileLeave(event){
     //console.log('fileleave', event);
   }
  async uploadFile(event){
    this.showUploadingFile();
    this.loading = true;
    this.fileUpload = event.target.files[0];
    const formData = new FormData();
   // console.log("id",id)
    formData.append("file", this.fileUpload);
    this._coursesService.uploadFile(formData).subscribe((response: any) => {
      //this.isHide = true;
      this._toastService.toasts = [];
      console.log(response);
      console.log("event.target.files[0]",event.target.files[0]);
      this.fileURL = response.data.url;
      this.name = event.target.files[0].name;
      console.log("this.fileURL",this.fileURL)
       if(response.status= "OK")
      this.createFileResource();
     

    });
  }
  createFileResource(){
    this.file.name = this.name;
    this.file.folder_id = this.folderId;
    this.file.url = this.fileURL;
    ;
    console.log(" this.file", this.file);
    this._coursesService.addResourceFile(this.file).subscribe(
      (response: any) => {
        this.loading = false;
        this.fileRes = response.data;
        this.fileRes.extension = this.fileURL.split('.').pop();
        console.log('res', response)
       this.resourceList.splice(0,0,this.fileRes);
       this.newExEvent.emit(this.resourceList);
       this.showSuccessAdd();

      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  showSuccessAdd() {
    this._toastService.show(undefined, {
    icon: '../../../../../assets/icons/course-detail/homework-iocn.svg',
    title: 'Added Successfully!',
    description: "You've just update your course information",
  });
}
showUploadingFile() {
  this._toastService.show(undefined, {
    icon: 'assets/icons/loading-gif-transparent-2.gif',
    title: 'Your File is Uploading!',
    description: "please be patient",
  }, false);
}
  close(){
    this.modalRef.close();
  }
}
