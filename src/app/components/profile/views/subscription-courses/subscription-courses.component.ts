import { ProfileService } from './../../profile.service';
import { Component, OnInit } from '@angular/core';
import { ICourse } from 'src/app/entities/API-entities/course';

@Component({
  selector: 'app-subscription-courses',
  templateUrl: './subscription-courses.component.html',
  styleUrls: ['./subscription-courses.component.scss'],
})
export class SubscriptionCoursesComponent implements OnInit {
  activeCourses: ICourse[];
  expiredCourses: ICourse[];
  constructor(private _profileService: ProfileService) {
    this.activeCourses = [];
    this.expiredCourses = [];
  }

  ngOnInit(): void {
    this.getActivecourses();
    this.getExpiredcourses();
  }
  getActivecourses() {
    this._profileService.getActiveStudentCourses().subscribe(
      (response) => {
        console.log(response.data.data);
        this.activeCourses = response.data.data;
      },
      (error) => {

      }
    );
  }
  getExpiredcourses() {
    this._profileService.getExpiredStudentCourses().subscribe(
      (response) => {
        this.expiredCourses = response.data.data;
      },
      (error) => {

      }
    );
  }
}
