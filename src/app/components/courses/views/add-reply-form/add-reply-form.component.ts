import { IMessage } from 'src/app/entities/API-entities/message';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../courses.service';
import { IReply } from 'src/app/entities/abstract-entities/reply';

@Component({
  selector: 'app-add-reply-form',
  templateUrl: './add-reply-form.component.html',
  styleUrls: ['./add-reply-form.component.scss']
})
export class AddReplyFormComponent implements OnInit {
  @Input() modalRef: NgbModalRef;
 // @Input() messageID: number;
  @Input() courseID: number;
  //@Input() senderName: number;
  //@Input() profileImage: number;
  @Input() messageObject: IMessage;
  @Input() messageListR: IMessage [];
  @Output() newExEvent = new EventEmitter<IMessage>();


  //messageList: IMessage [] = [];
  messageSection: FormGroup;
  messageObjj: IMessage;
  isMessageLoaded: boolean ;;
  repliesList: IReply[] = [];
  messageLoad: IMessage;
  constructor( private CoursesService: CoursesService,
   // private route: ActivatedRoute,
    private fb: FormBuilder,) { 
    this.messageSection = this.fb.group({
      message : new FormControl(),
      course_id: new FormControl(),
      is_private: new FormControl(),
      message_id: new FormControl()
    });
    this.isMessageLoaded = false;
    }

  ngOnInit(): void {
    this.messageLoad = this.messageObject;
    console.log("this.courseID", this.courseID);
    console.log("this.messageObject", this.messageObject);
/*     console.log("this.messageID", this.messageID);
    console.log("this.senderName", this.senderName);
    console.log("this.profileImage",this.profileImage);
 */   // this.getReplies();
  }
  hide(){
    this.modalRef.close();
  }
/*   getReplies(){
    this.CoursesService.findReplies(this.courseID, this.messageObject.id).subscribe(
      (response: any) => {

        this.messageObjj = response.data;
        this.repliesList = this.messageObjj.replies;
        console.log(' this.repliesList',  this.repliesList);

        console.log('resMessage', response);
        console.log("this.message",this.messageObjj);
        this.isMessageLoaded = true;
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  } */
  // send message
sendMessage(data){
  if(this.messageSection.valid){
    data.is_private = 0;
    data.course_id = this.courseID; 
    data.message_id = this.messageLoad.id;
    console.log("data",data)
    this.CoursesService.createStudentMessage(data).subscribe(
    (response: any) =>{
      console.log("responseCreate",response);
    this.messageObjj = response.data; // from backend edit response to be message with replies
    this.repliesList.push(this.messageObjj);
    this.messageListR[this.messageLoad.id].replies.push( this.messageObjj);
    console.log("this.messageListR[this.messageObject.id].replies",this.messageListR[this.messageObject.id].replies);
    this.messageObject.replies.push(this.messageObjj);
    this.newExEvent.emit(this.messageObject);
    console.log("newExEvent", this.newExEvent);
    this.messageSection.reset();
    },
    (error: HttpErrorResponse) => {
      console.error(error.status);
    }
  );
  }
  console.log("formgroup",data)
}

 
}
