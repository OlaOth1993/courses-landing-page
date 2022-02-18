import { ITeacher } from './../../../../entities/abstract-entities/teacher';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ICourse } from 'src/app/entities/API-entities/course';
import { StorageService } from 'src/app/services/storage.service';
import { CoursesService } from '../../courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teacher-courses',
  templateUrl: './teacher-courses.component.html',
  styleUrls: ['./teacher-courses.component.scss']
})
export class TeacherCoursesComponent implements OnInit {
  courses: ICourse[] = [];
  courseOb: ICourse;
  teacher: ITeacher;


  secondPageCourses: ICourse[] = [];
  ThirdPageCourses: ICourse[];
  allCourse : ICourse;
  secondPage: boolean = true;
  second_page_url: string;
  currenPage: number = 1;
  teacher_id: number;
  constructor(
    private CoursesService: CoursesService,
    private datepipe: DatePipe,
    private storage: StorageService,
    private route: ActivatedRoute
  ) { }
    // back again to to receive teacher id from previous page
  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.teacher_id = params["id"]));
    console.log('this.teacher_id',this.teacher_id)
    this.requestData();
  }

  getTeacherInfo(teacher_id:number): void {
    this.CoursesService.getTeacherInfo(teacher_id).subscribe(
      (response: any) => {

       this.teacher = response.data;
        console.log('res', response)
       console.log(' this.teacher', this.teacher)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  getCourses(teacher_id:number, page: number): void {
    this.CoursesService.getTeacherCourses(teacher_id,page).subscribe(
      (response: any) => {

        this.allCourse = response.data;
       this.courses = response.data.data;
       this.currenPage = response.data.current_page;

       this.courses.forEach((course:ICourse) =>
       {
         course.start_time = this.datepipe.transform( course.start_time, 'MMMM-dd  ')
       });
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
  requestData(): void {
    this.getTeacherInfo(this.teacher_id);
    this.getCourses(this.teacher_id,1);
  }


}
