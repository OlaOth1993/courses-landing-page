import { CoursesService } from '../../courses.service';
import { ICourse } from './../../../../entities/API-entities/course';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, Location } from "@angular/common";
import { ISub_category } from './../../../../entities/abstract-entities/sub-category';
import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-all-courses',
  templateUrl: './all-courses.component.html',
  styleUrls: ['./all-courses.component.scss']
})
export class AllCoursesComponent implements OnInit {
    courses: ICourse[];
    courseOb: ICourse;
    secondPageCourses: ICourse[] = [];
    ThirdPageCourses: ICourse[];
    allCourse : ICourse;
    secondPage: boolean = true;
    second_page_url: string;
    currenPage: number = 1;
    subCategory: ISub_category;
    title: string;

  constructor(private CoursesService: CoursesService,
    private datepipe: DatePipe,
    private storage: StorageService
    ) {
      this.title  = 'All Courses ';
    }

  ngOnInit(): void {
    this.subCategory =  this.storage.getLocalObject('subCategory-courses');
    console.log('sub', this.subCategory);
    this. requestData();
  }
  ngOnDestroy(): void{
    this.storage.removeLocalObject('subCategory-courses');
  }
  requestData(): void {
    this.getCourses(this.subCategory.id);
  }

  getCourses(subID:number): void {
    this.CoursesService.getAllCourses(subID,1).subscribe(
      (response: any) => {

        this.allCourse = response.data;
       this.courses = response.data.data;
       this.currenPage = response.data.current_page;

       this.courses.forEach((course:ICourse) =>
       {
         course.start_time = this.datepipe.transform( course.start_time, 'MMMM-dd  ')
       });
        console.log('res', response)
        console.log(this.allCourse)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  loadSecondPageCourses(subID:number, nextPage: number){
    this.secondPage = false;
    console.log('load')

    this.CoursesService.getAllCourses(subID, nextPage).subscribe(
      (response: any) => {
          this.secondPageCourses = response.data.data;
          this.second_page_url = response.data.next_page_url;
          this.currenPage = response.data.current_page;
           console.log('res', response)
           this.secondPageCourses.forEach((course:ICourse) =>
           {
             course.start_time = this.datepipe.transform( course.start_time, 'MMMM-dd  ')
           });

         },
         (error: HttpErrorResponse) => {
           console.error(error.status);
         }
       );

  }

}
