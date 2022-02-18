import { ICourse } from './../../../../entities/API-entities/course';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { CoursesService } from '../../courses.service';
//import * as $ from 'jquery';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { NgbPaginationNumber } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class CourseDetailComponent implements OnInit {
  course: ICourse;

  courseId: number;

  complete_ratio = 75;

  coursesList: ICourse[] = [];
  stickyHeaderTop: any;
  isPageDownload: boolean = false;
  courseIDStorage: number;
  teacherCourseStorage: number;
  userCourseIDStorage: number;
  courseDescription: any;
  courseImage: any;
  subCategory_id: number;
  constructor(
    private coursesService: CoursesService,
    private datepipe: DatePipe,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.subCategory_id = this.storage.getLocalObject('subCategory-id');
    this.route.params.subscribe((params) => (this.courseId = params["id"]));
    console.log(this.courseId, "hhhhh")
    this.requestData();

    window.addEventListener('scroll', this.scroll, true);
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scroll, true);
  }

  requestData(): void {
    this.getCourseDetail(this.courseId);
    // this.getCourses(this.subCategory_id);
  }



  getCourseDetail(courseID: number): void {
    console.log('getCourseDetail');
    this.coursesService.getCourseDetail(courseID).subscribe(
      (response: any) => {
        this.course = response.data;
        console.warn("courses Details", this.course);
        this.courseIDStorage = this.course.id;
        if (response.data.joined_course_information) {
          this.teacherCourseStorage = response.data.joined_course_information.id;
          this.userCourseIDStorage = response.data.joined_course_information.id;
        }

        this.courseDescription = this.course.description;
        console.log('this.teacherCourseStorage ', this.teacherCourseStorage);// to group discuss
        this.isPageDownload = true;
        console.log('res', response);
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  getCourses(subID: number): void {
    this.coursesService.getAllCourses(subID, 1).subscribe(
      (response: any) => {
        this.coursesList = response.data.data;
        console.log('res', this.coursesList);
        this.coursesList.forEach((course: ICourse) => {
          course.start_time = this.datepipe.transform(
            course.start_time,
            'MMMM-dd  '
          );
        });
        this.isPageDownload = true;
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  scroll = (event): void => {
    this.addEventListenerNav();
  };
  addEventListenerNav() {

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        let parent = document.querySelector(
          `li a[href="/courses/course-detail#${id}"]`
        )?.parentElement;

        if (parent == null) return null;
        if (entry.intersectionRatio > 0) {
          document
            .querySelector(`li a[href="/courses/course-detail#${id}"]`)
            .parentElement.classList.add('active');
        } else {
          document
            .querySelector(`li a[href="/courses/course-detail#${id}"]`)
            .parentElement.classList.remove('active');
        }
      });
    });

    // Track all sections that have an `id` applied
    document.querySelectorAll('div[id]').forEach((section) => {
      observer.observe(section);
    });

  }

  goToTeacherCourses(id: number) {
    this.router.navigate(["./teacher-courses", id]);
  }
  goToCourseHomework(id: number) { //user is student
    id = this.courseIDStorage;
    this.storage.setLocalObject('course_id', id);
    this.storage.setLocalObject('user_course_id', this.userCourseIDStorage);

    this.router.navigate(["./courses/course-homework", id]);
  }
  goToChatGroup(id: number) {
    this.router.navigate(["./courses/chat-group", this.courseIDStorage]); // {des: this.courseDescription} //, skipLocationChange: true
    this.storage.setLocalObject('teacher_id', id);

  }
  goToTeacherDiscussHomework() {//user is teacher
    this.storage.setLocalObject('teacher_course_id', this.teacherCourseStorage);
    this.storage.setLocalObject('course_id', this.courseIDStorage);

    this.router.navigate(["./courses/group-discuss"]);
  }
  goLive(uid) {
    this.router.navigate(["/courses/course-detail", this.courseIDStorage, "live"]);
    this.coursesService.setUserType('teacher', uid);
  }
  joinLive(uid) {
    this.router.navigateByUrl("courses/course-detail/live");
    this.coursesService.setUserType('student', uid);
  }
  goToResource() {
    this.router.navigate(["./courses/resources"]);
  }
  goToTeacherResource() {
    this.storage.setLocalObject('teacher_course_id', this.teacherCourseStorage);
    // this.storage.setLocalObject('course_id', this.courseIDStorage);
    this.router.navigate(["./courses/teacher-resource"]);
  }
}
