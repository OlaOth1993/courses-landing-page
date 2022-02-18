import { ProfileService } from './../../profile.service';
import { Component, OnInit } from '@angular/core';
import { ICourse } from 'src/app/entities/API-entities/course';

@Component({
  selector: 'app-given-courses',
  templateUrl: './given-courses.component.html',
  styleUrls: ['./given-courses.component.scss']
})
export class GivenCoursesComponent implements OnInit {
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
    this._profileService.getActiveTeacherCourses().subscribe(
      (response) => {
        console.log("active",response);
        this.activeCourses = response.data.data;
      },
      (error) => {

      }
    );
  }
  getExpiredcourses() {
    this._profileService.getExpiredTeacherCourses().subscribe(
      (response) => {
        console.log("expired",response);
        this.expiredCourses = response.data.data;
      },
      (error) => {

      }
    );
  }

}
