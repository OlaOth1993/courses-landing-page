import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ICourse } from 'src/app/entities/API-entities/course';
import { StorageService } from 'src/app/services/storage.service';
import { CoursesService } from '../../courses/courses.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent implements OnInit {
  @Input() courseOb: ICourse;
  subCategory_id: number;
  constructor(
    private CoursesService: CoursesService,
    private _router: Router,
    private datepipe: DatePipe,
    private storage: StorageService

  ) {}

  ngOnInit(): void {
    this.subCategory_id = this.courseOb.category_id;

  }

  goToCoursDetail() {
    this.storage.setLocalObject('subCategory-id', this.subCategory_id);
    this._router.navigateByUrl('/courses/course-detail/'+ this.courseOb.id);
  }
}
