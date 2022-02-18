import { CourseActions } from 'src/app/actions/course-actions';
import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { ClientActions } from './../../actions/client-actions';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { IUserModel } from 'src/app/entities/abstract-entities/user-model';
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  client: ClientActions;
  course: CourseActions;
  user: any;
  constructor(http: HttpClient, private _storageService: StorageService) {
    this.client = new ClientActions(http);
    this.course = new CourseActions(http);
    this.user = this._storageService.getLocalObject('user');
  }
  getUsernfo(): any {
    return this.client.readUser().pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  showProfileInfo(): any {
    return this.client.readUserProfile(this.user.id).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  updateProfile(user: IUserModel) {
    return this.client.updateUserProfile(user).pipe(
      catchError((err) => {
        console.error('update error', err);
        return throwError(err);
      })
    );
  }

  changePassword(password: any) {
    return this.client.changePassword(password).pipe(
      catchError((err) => {
        console.error('update error', err);
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

  uploadVideo(file: any) {
    return this.client.uploadVideo(file).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  logout() {
    this._storageService.removeToken();
    this._storageService.removeLocalObject('user');
  }
  getActiveStudentCourses(): any {
    return this.course.readActiveStudentCourses().pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getExpiredStudentCourses(): any {
    return this.course.readExpiredStudentCourses().pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getActiveTeacherCourses(): any {
    return this.course.readActiveTeacherCourses({teacher_id:this.user.id}).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getExpiredTeacherCourses(): any {
    return this.course.readExpiredTeacherCourses({teacher_id:this.user.id}).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
