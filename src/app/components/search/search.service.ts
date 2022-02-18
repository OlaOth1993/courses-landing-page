import { LanguageActions } from './../../actions/language-actions';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICourse } from 'src/app/entities/API-entities/course';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { CourseActions } from 'src/app/actions/course-actions';
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  courses: CourseActions;
  language: LanguageActions;
  constructor(http: HttpClient) {
    this.courses = new CourseActions(http);
    this.language = new LanguageActions(http);
  }
  getFilteredCourses(filteringObj):any {
    return this.courses.filterCourses(filteringObj).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  getLanguages():any {
    return this.language.readLanguages().pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
