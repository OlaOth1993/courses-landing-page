

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CourseActions } from '../../actions/course-actions';
import { ContactActions } from 'src/app/actions/contact-actions'
import { CategoryActions } from 'src/app/actions/category-actions';
import { IContact } from './../../entities/API-entities/contact';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  category: CategoryActions;
  course: CourseActions;
  contact: ContactActions;
  constructor(http: HttpClient) {
    this.category = new CategoryActions(http);
    this.course = new CourseActions(http);
    this.contact = new ContactActions(http);
  }
  getCategories(): any{
    return this.category.readCategories()
      .pipe(
        catchError((err) => {
          return throwError(err);
      })
    )
  }
  getCourses(): any {
    return this.course.readCourses()
      .pipe(
        catchError((err) => {
          return throwError(err);
      })
    )
  }
  contactUs(contact:IContact) {
    return this.contact.createContact(contact)
      .pipe(
        catchError((err) => {
        return throwError(err)
      })
    )
  }
}
