import { ITeacher } from './../../../entities/abstract-entities/teacher';
import { CRUDService } from 'src/app/services/crud.service';
import { ICourse } from 'src/app/entities/API-entities/course';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class TeacherCoursesAction extends CRUDService<ITeacher> {
  constructor(http: HttpClient) {
    super(http, 'client/');
  }

  readTeacherInfo(id:number): Observable<ITeacher> {
    return this.readEntity(id,'showUserprofile' );
  }
}
