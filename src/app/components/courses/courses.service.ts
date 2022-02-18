import { IResource } from './../../entities/abstract-entities/resource';
import { IFolder } from './../../entities/abstract-entities/folder';
import { IHomework } from '../../entities/abstract-entities/homework';
import { IMessage } from '../../entities/API-entities/message';
import { MessageAction } from './action/message-action';
import { ISolution } from '../../entities/abstract-entities/solution';
import { ISchedule } from '../../entities/abstract-entities/Schedule';
import { ClientActions } from '../../actions/client-actions';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AllCoursesActions } from './action/all-courses-action';
import { TeacherCoursesAction } from './action/teacher-courses-action'
import { HomeworkAction } from './action/homework-action';
import { LanguagesActions } from './action/all-languages-action';
import { CourseActions } from 'src/app/actions/course-actions';
import { ICourse } from 'src/app/entities/API-entities/course';
@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  courses: AllCoursesActions;
  teacher: TeacherCoursesAction;
  client: ClientActions;
  homework: HomeworkAction;
  message: MessageAction;
  course: CourseActions;


  languages: LanguagesActions;
  userType: string;
  uid: number;

  constructor(http: HttpClient) {
    this.courses = new AllCoursesActions(http);
    this.teacher = new TeacherCoursesAction(http);
    this.client = new ClientActions(http);
    this.homework = new HomeworkAction(http);
    this.message = new MessageAction(http);
    this.languages = new LanguagesActions(http)
    this.course = new CourseActions(http);
  }
  getAllCourses(subID: number, page: number): any {
    return this.courses.readAllCourses(subID, 6, page)
      .pipe(
        catchError((err) => {
          console.error('error caught in service')
          return throwError(err);
        })
      );
  }
  getCourseDetail(id: number): any {
    return this.courses.readCoursesDetail(id)
      //! Service scope error handling
      .pipe(
        catchError((err) => {
          console.error('error caught in service')
          return throwError(err);
        })
      );
  }
  getTeacherCourses(teacherId: number, page: number) {
    return this.courses.readTeacherCourses(teacherId, page)
      .pipe(
        catchError((err) => {
          console.error('error caught in service')
          return throwError(err);
        })
      );
  }

  getTeacherInfo(id: number) {
    return this.teacher.readTeacherInfo(id)
      .pipe(
        catchError((err) => {
          console.error('error caught in service')
          return throwError(err);
        })
      );
  }
  getHomeworkCourse(id: number) {
    return this.courses.readHomeworkCourse(id)
      .pipe(
        catchError((err) => {
          console.error('error caught in service')
          return throwError(err);
        })
      );
  }

  getCourseFolders(id: number) {
    return this.courses.readCourseFolders(id)
      .pipe(
        catchError((err) => {
          console.error('error caught in service');
          return throwError(err);
        })
      );
  }
  uploadFile(file: any) {
    return this.client.uploadFile(file).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  uploadSolution(solution: ISolution) {
    return this.homework.uploadSolution(solution).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );

  }
  getMessageStudent(course_id: number, is_private: number) {
    return this.message.readMessageStudent(course_id, is_private)
      .pipe(
        catchError((err) => {
          console.error('error caught in service');
          return throwError(err);
        })
      );
  }
  createStudentMessage(message: IMessage) {
    return this.message.createMessage(message)
      .pipe(
        catchError((err) => {
          console.error('error caught in service');
          return throwError(err);
        })
      );
  }
  getMessageAsTeacher(course_id: number, is_private: number, receiver_id: number) {
    return this.message.readMessageAsTeacher(course_id, is_private, receiver_id)
      .pipe(
        catchError((err) => {
          console.error('error caught in service');
          return throwError(err);
        })
      );
  }
  uploadHomework(homework: IHomework) {
    return this.homework.uploadHomework(homework).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getStudentCourse(id: number) {
    return this.courses.readStudentCourse(id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  deleteHomework(id: number) {
    return this.homework.deleteHomework(id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  findHomeworkSolution(user_course_id: number, homework_id: number) {
    return this.homework.findSolution(user_course_id, homework_id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getHomeworkWithSolution(user_course_id: number) {
    return this.homework.readHomeworkWithSolution(user_course_id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getHomeworkWithSolutionTeacher(user_course_id: number, teacher_course_id: number) {
    return this.homework.readHomeworkWithSolutionTeacher(user_course_id, teacher_course_id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  deleteSolution(id: number) {
    return this.homework.deleteSolution(id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getLanguages(): any {
    return this.languages.readAllLanguages();
  }

  getParentCategory(query): Observable<any> {
    return this.course.readCategory(query)
  }

  getCourse(courseId): Observable<ICourse> {
    return this.course.readCourse(courseId);
  }

  createCourse(courseForm: ICourse): Observable<ICourse> {
    return this.course.createCourse(courseForm);
  }

  editCourse(courseId, courseForm: any): any {
    return this.course.editCourse(courseId, courseForm);
  }
  findReplies(course_id: number, message_id: number){
    return this.message.readReplies(course_id,message_id);
  }
  download(resource: IResource): Observable<any>{
    return this.client.downlodFile(resource)
    .pipe(
      catchError((err) => {
        console.error('error caught in service');
        return throwError(err);
      })
    );
  }
  deleteFolders(id: number){
    return this.courses.deleteFolder(id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  renameFolder(folder: IFolder){
    return this.courses.updateFolder(folder).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  addFolder(folder: IFolder){
    return this.courses.createFolder(folder).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  deleteResource(id: number){
    return this.courses.deleteResourceFile(id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  addResourceFile(file: IResource) {
    return this.courses.createResourceFile(file).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  setUserType(userType:string,uid:number) {
    this.userType = userType;
    this.uid = uid;
  }
  getNotification(){
    return this.client.getNotification().pipe(
      catchError((err) => {
        return throwError(err);
      })
    );  
  }
}
