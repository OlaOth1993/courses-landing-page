import { IHomework } from './../../../../entities/abstract-entities/homework';
import { IUser } from 'src/app/entities/API-entities/user';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ISolution } from 'src/app/entities/abstract-entities/solution';
import { IMessage } from 'src/app/entities/API-entities/message';
import { CoursesService } from '../../courses.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { userInfo } from 'node:os';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-group-discuss',
  templateUrl: './group-discuss.component.html',
  styleUrls: ['./group-discuss.component.scss']
})
export class GroupDiscussComponent implements OnInit {
  homeworkList: IHomework[] = [];
  homework: IHomework;
  fileUpload: string;
  fileURL: string;
  solution: ISolution;
  solutionList: ISolution [] = [];
  messageList: IMessage [] = [];
  messageSection: FormGroup;
  panelOpenState = false;
  modalRef: NgbModalRef;
  files: any[] = [];
  studentList: IUser [] = [];
  homeworkWithoutSol: IHomework [] = [];
  homeworkWithSol:IHomework [] = [];
  teacher_course_id: number;
  course_id: number;
  receiver_id: number;
  courseID: number;
  constructor(private datepipe: DatePipe,
    private CoursesService: CoursesService,
    private fb: FormBuilder,
    private _modalService: NgbModal,
    private storage: StorageService,

   // private el: ElementRef,
   // private renderer: Renderer2
    ) {
      this.messageSection = this.fb.group({
        // DON'T FORGET THE FORM INITIALISATION
        message : new FormControl(),
        course_id: new FormControl(),
        is_private: new FormControl(),
        receiver_id: new FormControl(),

      });
     // window.scrollTo(0,document.body.scrollHeight);
   /*   var Chat = document.body.getElementsByClassName('chat');
     (window as any).Chat.scrollTo(0,document.body.scrollHeight); */
     }

  ngOnInit(): void {  
      this.teacher_course_id = this.storage.getLocalObject('teacher_course_id');
      this.course_id = this.storage.getLocalObject('course_id');
      console.log("this.course_id",this.course_id);
      this.solution = new ISolution();
      this.requestData();

  }
  requestData(): void {
    this.getStudentOfCourse();
    //console.log('this.studentList[0].id' ,this.studentList[0].id);

  }
/*     async uploadFile(event, id:number){
      this.fileUpload = event.target.files[0];
      const formData = new FormData();
      console.log("id",id)
      formData.append("file", this.fileUpload);
      this.CoursesService.uploadFile(formData).subscribe((response: any) => {
        console.log(response);

        this.fileURL = response.data.url;
        console.log("this.fileURL",this.fileURL)
        if(response.status= "OK")
        this.uploadSolution(id)
      });

    } */

/*     async uploadSolution(id: number ){

      this.solution.homework_id = id;
      this.solution.user_course_id = 3;
      this.solution.url = this.fileURL;
            this.CoursesService.uploadSolution(this.solution).subscribe(
        (response: any) => {

          this.solutionList = response.data;

          console.log('res', response)
          console.log(this.solutionList)
        },
        (error: HttpErrorResponse) => {
          console.error(error.status);
        }
      );

    } */

/*   getHomeworks(user_course_id:number, courseId:number): void {
    this.CoursesService.getHomeworkCourse(courseId).subscribe(
      (response: any) => {

        this.homeworkList = response.data;

        console.log('res', response)
        console.log('this.studentList',this.studentList[0]);
        this.homeworkList.forEach((hom: IHomework) => {

          this.findHomeworkSolution(user_course_id,hom.id);

         });
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  } */
  findHomeworkSolution(user_course_id: number, homework_id: number){
    this.CoursesService.findHomeworkSolution(user_course_id,homework_id).subscribe(
      (response: any) => {
       this.homeworkList[homework_id].solution = new ISolution();
       this.homeworkList[homework_id].solution = response.data;

        console.log('res', response)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  downloadFile(path: string){
      window.open(path, '_blank');
  }
  getMessagesAsTeacher(course_id: number, receiver_id: number){
    this.CoursesService.getMessageAsTeacher(course_id,1,receiver_id).subscribe(
      (response: any) => {

        this.messageList = response.data;

        console.log('resMessage', response)
        console.log(this.messageList)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  openFileModal(content) {
    this.courseID = this.course_id;
    this.modalRef = this._modalService.open(content, { centered: true });
  }
  sendMessageAsTeacher(data){
    if(this.messageSection != null){
      data.is_private = 1;
      data.course_id = this.course_id; //////
      data.receiver_id = this.receiver_id; //////
    this.CoursesService.createStudentMessage(data).subscribe(
      (response: any) =>{
        console.log("responseCreate",response);
        //this.messageList.splice(0,0,data);
     this.messageList.push(data);
     this.messageSection.reset();
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
    }
    console.log("formgroup",data)

  }
  getStudentOfCourse(){
    this.CoursesService.getStudentCourse(this.course_id).subscribe(
      (response: any) => {

        this.studentList = response.data;

        console.log('resStudent', response)
        console.log(this.studentList);
        if( this.studentList[0] ){
        this.studentList[0].is_active = true;
        this.getHomeworks(this.studentList[0].id,2);
        this.getMessagesAsTeacher(this.course_id,this.studentList[0].id);
        this.receiver_id = this.studentList[0].id;
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  getHomeworks(user_course_id: number, teacher_course_id: number){
    this.CoursesService.getHomeworkWithSolutionTeacher(this.studentList[0].id,teacher_course_id).subscribe(
      (response: any) => {

        this.homeworkList = response.data;
        this.homeworkList.forEach((hom: IHomework) => {
          if(hom.user_homework.length == 0){
            this.homeworkWithoutSol.push(hom);
          }
          else if(hom.user_homework.length != 0){
          this.homeworkWithSol.push(hom)
          }
         });
         console.log(" this.homeworWithSol", this.homeworkWithSol)
         console.log(" this.homeworkWithoutSol", this.homeworkWithoutSol)

        console.log('res', response)
        console.log(this.homeworkList)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  transformChat(student: IUser){
   this.studentList.forEach((st: IUser) => {
        st.is_active = false;
   });
   student.is_active = true;
   this.homeworkWithSol = [];
   this.homeworkWithoutSol = [];
   this.receiver_id = student.id;
   this.getMessagesAsTeacher(this.course_id,student.id); //course_id
    this.getHomeworks(student.id,this.teacher_course_id);
  }
}
