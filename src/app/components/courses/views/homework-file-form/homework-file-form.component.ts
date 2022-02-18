import { IHomework } from './../../../../entities/abstract-entities/homework';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../courses.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-homework-file-form',
  templateUrl: './homework-file-form.component.html',
  styleUrls: ['./homework-file-form.component.scss']
})
export class HomeworkFileFormComponent implements OnInit {
  @Input() modalRef: NgbModalRef;
  @Input() HomeworkList: IHomework[];
  @Input() course_id: number;

  @Output() newExEvent = new EventEmitter<IHomework[]>();

  homework: IHomework;
  fileUpload: string;
  fileURL: string;
  name: any;
  homeworkList: IHomework[] = [];
  homeworkUpload: IHomework;
  constructor(
    private CoursesService: CoursesService,
    private _toastService: ToastService,
  ) { }

  ngOnInit(): void {
    console.log("courseid", this.course_id)
    this.homeworkUpload = new IHomework();
    this.getHomeworks(this.course_id);
  }
  hide() {
    this.modalRef.close();
  }
  getHomeworks(courseId: number): void {
    this.CoursesService.getHomeworkCourse(courseId).subscribe(
      (response: any) => {

        this.homeworkList = response.data;

        console.log('res', response)
        console.log(this.homeworkList)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }

  async uploadFile(event) {
    this.showUploadingFile();
    this.fileUpload = event.target.files[0];
    const formData = new FormData();
    // console.log("id",id)
    console.log("fileUpload", event.target.files[0].name)
    formData.append("file", this.fileUpload);
    this.CoursesService.uploadFile(formData).subscribe((response: any) => {
      console.log(response);
      this._toastService.toasts = [];
      this.fileURL = response.data.url;
      this.name = event.target.files[0].name;
      console.log("this.name", this.name)
      console.log("this.fileURL", this.fileURL)
      if (response.status = "OK")
        this.uploadHomework();
    });

  }

  uploadHomework() {
    this.homeworkUpload.course_id = 1;
    this.homeworkUpload.name = this.name; // from previous 
    this.homeworkUpload.url = this.fileURL;
    console.log("this.homeworkUpload", this.homeworkUpload)
    this.CoursesService.uploadHomework(this.homeworkUpload).subscribe(
      (response: any) => {
        this.showSuccessAdd();
        // this.homeworkList = response.data;
        this.homeworkList.push(this.homeworkUpload);
        console.log('res', response);
        console.log(this.homeworkList);
        this.HomeworkList.splice(0, 0, this.homeworkUpload);
        this.newExEvent.emit(this.HomeworkList);
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  deleteHomework(id: number) {
    this.CoursesService.deleteHomework(id).subscribe(
      (response: any) => {

        this.homeworkList = this.homeworkList.filter(i => i.id !== id);

        console.log('res', response)
        console.log(this.homeworkList)
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

}
