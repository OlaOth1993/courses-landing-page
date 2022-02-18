import { IMessage } from './../../../entities/API-entities/message';
import { CRUDService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class MessageAction extends CRUDService<IMessage> {
  constructor(http: HttpClient) {
    super(http, 'course');
  }

  // private chat in student Disccus with Teacher
  readMessageStudent(course_id: number, is_private: number ) {
    return this.readEntities( undefined,'/message/get'+'?course_id='+ course_id +'&is_private='+is_private );
  }
  createMessage(message: IMessage){
    return this.createEntity(message,'/message/create');
  }
  readMessageAsTeacher(course_id: number, is_private: number, receiver_id: number){
    return this.readEntities( undefined,'/message/get'+'?course_id='+ course_id + '&is_private=' + is_private + '&receiver_id=' + receiver_id);
  }
  readReplies(course_id: number, message_id: number){
    return this.readEntities(undefined, '/message/find' + '?course_id=' + course_id + '&message_id=' + message_id);
  }
}