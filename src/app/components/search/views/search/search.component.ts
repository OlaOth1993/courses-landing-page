import { ILanguage } from './../../../../entities/abstract-entities/language';
import { ICourse } from './../../../../entities/API-entities/course';
import { ISub_category } from './../../../../entities/abstract-entities/sub-category';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/components/category-module/category.service';
import { SearchService } from '../../search.service';
import { ICategory } from 'src/app/entities/API-entities/category';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  course_name: string;
  categories: ICategory;
  subCategories: ISub_category;
  languages: ILanguage;
  courses: ICourse;
  selectedCategory: string;
  selectedsubCategory: string;
  selectedLevel: string;
  selectedPrice: number;
  selectedLanguage: string;
  currentRate: number = 3;
  rates = [1, 2, 3, 4, 5];
  constructor(
    private _categoryService: CategoryService,
    private _searchService: SearchService
  ) {
    this.course_name = null;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getLanguages();
  }
  getCategories() {
    this._categoryService.getCategories().subscribe(
      (response) => {
        console.log('categories', response);
        this.categories = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getSubCategories(categoryId: number) {
    this._categoryService.getSubCategories(categoryId).subscribe(
      (response) => {
        console.log('subCategories', response);
        this.subCategories = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getLanguages() {
    this._searchService.getLanguages().subscribe(
      (response) => {
        console.log('languages', response);
        this.languages = response.data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  setFilteringObject() {
    let filteringObj = {
      level: this.selectedLevel,
      language_id: this.selectedLanguage,
      category_id: this.selectedsubCategory,
      course_name: this.course_name,
    };
    for (const [key, value] of Object.entries(filteringObj)) {
      if (value == undefined) delete filteringObj[key];
    }
    return filteringObj;
  }
  getCourses() {
    let filteringObj = this.setFilteringObject();
    console.log('filteringObj', filteringObj);
    console.log('course-name', this.course_name);
      this._searchService.getFilteredCourses(filteringObj).subscribe(
        (response) => {
          console.log('courses', response);
          this.courses = response.data.data;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
