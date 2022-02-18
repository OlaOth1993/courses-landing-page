
import { ISolution } from './../../../entities/abstract-entities/solution';
import { IHomework } from './../../../entities/abstract-entities/homework';
import { CRUDService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class HomeworkAction extends CRUDService<any> {
  constructor(http: HttpClient) {
    super(http, 'course');
  }

  uploadSolution(solution: ISolution){
    return this.createEntity(solution,'/userHomework/create');
  }
  uploadHomework(homework: IHomework){
    return this.createEntity(homework,'/homework/create');
  }
  deleteHomework(homework_id: number){
    return this.deleteEntity(homework_id,'/homework/delete');
  }
  findSolution(user_course_id: number, homework_id: number){
    return this.readEntities(undefined, '/userHomework/find' + '?user_course_id=' + user_course_id + '&homework_id=' + homework_id )
  }
  readHomeworkWithSolution(user_course_id:number){
    return this.readEntities(undefined, '/homework/student/all/' + user_course_id );
  }
  readHomeworkWithSolutionTeacher(user_course_id:number, teacher_course_id:number){
    return this.readEntities(undefined, '/homework/student/all/' + user_course_id + '?teacher_course_id=' + teacher_course_id);
  }
  deleteSolution(id:number){
    return this.deleteEntity(id,'/userHomework/delete');

  }
}