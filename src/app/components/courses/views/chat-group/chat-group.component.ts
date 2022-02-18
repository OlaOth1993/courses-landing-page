import { IReply } from './../../../../entities/abstract-entities/reply';
import { IMessage } from 'src/app/entities/API-entities/message';
import { MessageAction } from './../../action/message-action';
import { userInfo } from 'node:os';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ITeacher } from 'src/app/entities/abstract-entities/teacher';
import { IUser } from 'src/app/entities/API-entities/user';
import { StorageService } from 'src/app/services/storage.service';
import { CoursesService } from '../../courses.service';
//import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss']
})
export class ChatGroupComponent implements OnInit {
  panelOpenState = false;
  messageList: IMessage [] = [];
  messageObj:IMessage;
  messageSection: FormGroup;
  studentList: IUser [] = [];
  modalRef: NgbModalRef;
  order: any;
  course_id: number;
  message_id : number;
  teacher: ITeacher;
  teacher_id: number;
  user_full_name: string;
  profile_image: string;
  message_obj: IMessage;
  replies_list: IReply [] = [];
  constructor(
        private CoursesService: CoursesService,
        private _modalService: NgbModal,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private storage: StorageService,

    ) {
      this.messageSection = this.fb.group({
        message : new FormControl(),
        course_id: new FormControl(),
        is_private: new FormControl(),
      });
     }

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.course_id = params["id"]));
    this.route.queryParamMap.subscribe(params => console.log(params)); //
    console.log("this.course_id : ",this.course_id)
    this.teacher_id = this.storage.getLocalObject('teacher_id');
    console.log("teacher_id : ", this.teacher_id)

    this.messageObj = new IMessage();
    console.log("dessssscription",this.order )
    this.getMessages();
    this.getTeacherInfo(this.teacher_id);
    this.getStudentOfCourse();
    
  }
  getTeacherInfo(teacher_id:number): void {
    this.CoursesService.getTeacherInfo(teacher_id).subscribe(
      (response: any) => {

       this.teacher = response.data;
        console.log('res', response)
       console.log(' this.teacher', this.teacher)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  getMessages(){
    this.CoursesService.getMessageStudent(1,0).subscribe(
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
  getStudentOfCourse(){
    this.CoursesService.getStudentCourse(1).subscribe(
      (response: any) => {

        this.studentList = response.data;

        console.log('resStudent', response)
        console.log(this.studentList);
        this.studentList[0].is_active = true;
       /// this.getHomeworks(this.studentList[0].id,1);
      //  this.getMessagesAsTeacher(1,this.studentList[0].id);

      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
// send message
sendMessage(data){
  if(this.messageSection.valid){
    data.is_private = 0;
    data.course_id = this.course_id; 
    this.CoursesService.createStudentMessage(data).subscribe(
    (response: any) =>{
      console.log("responseCreate",response);
    //this.messageList.push(data);
    this.messageObj = response.data;
    //this.messageObj.sender.user = response.data.user;
    this.messageObj.replies = [];
    console.log("this.messageObj",this.messageObj)
    this.messageList.push(this.messageObj);
    this.messageSection.reset();
   // this.getMessages(); // problem 
    },
    (error: HttpErrorResponse) => {
      console.error(error.status);
    }
  );
  }
  console.log("formgroup",data)
}

  openFileModal(content,message: IMessage) {
    //this.message_id = id;
    //this.user_full_name = full_name;
   // this.profile_image = image;
   this.replies_list = message.replies;
    this.message_obj = message;
    this.modalRef = this._modalService.open(content, { centered: true, windowClass : "myCustomModalClass"});
  }
  
}
