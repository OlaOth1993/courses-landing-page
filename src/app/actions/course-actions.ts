import { CRUDService } from 'src/app/services/crud.service';
import { ICourse } from 'src/app/entities/API-entities/course';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class CourseActions extends CRUDService<ICourse> {
  constructor(http: HttpClient) {
    super(http, 'course');
  }

  readCategory(params): Observable<any> {
    return this.readEntities(params, '/category/find');
  }

  readCourses(): Observable<ICourse[]> {
    return this.readEntities(undefined, '/popular');
  }
  filterCourses(filterObject: any): Observable<ICourse[]> {
    return this.readEntities(filterObject, '/get');
  }

  readActiveStudentCourses(): Observable<ICourse[]> {
    return this.readEntities(undefined, '/student/active');
  }
  readExpiredStudentCourses(): Observable<ICourse[]> {
    return this.readEntities(undefined, '/student/expired');
  }
  readActiveTeacherCourses(teacher: any): Observable<ICourse[]> {
    return this.readEntities(teacher, '/teacher/active');
  }
  readExpiredTeacherCourses(teacher: any): Observable<ICourse[]> {
    return this.readEntities(teacher, '/teacher/expired');
  }

  readCourse(Id): Observable<ICourse> {
    return this.readEntity(Id, '');
  }

  createCourse(courseForm: ICourse): Observable<any> {
    return this.createEntity(courseForm, '/create');
  }

  editCourse(Id: number, form: any): Observable<any> {
    return this.updateQueryEntity(form, '/update/' + Id);
  }

}
