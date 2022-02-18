import { ICategory } from 'src/app/entities/API-entities/category';
import { ISub_category } from './../../entities/abstract-entities/sub-category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CategoryActions } from './actions/category-actions';
import { SubCategoryActions } from './actions/sub-category-actions';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  category: CategoryActions;
  subCategory: SubCategoryActions;
  sharedCategories = new Subject<ISub_category[]>();
  sharedSubCategories = new BehaviorSubject<ISub_category>(null);
  constructor(http: HttpClient) {
    this.category = new CategoryActions(http);
    this.subCategory = new SubCategoryActions(http);
  }
  getCategories(): any {
    return (
      this.category
        .readCategories()
        //  ! Service scope error handling
        .pipe(
          catchError((err) => {
            console.error('error caught in service');
            return throwError(err);
          })
        )
    );
  }

  getSubCategories(categoryId: number): any {
    return this.subCategory.readSubCategories(categoryId);
  }
}
