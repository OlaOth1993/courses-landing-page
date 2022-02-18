import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PathComponent } from './path/path.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { FieldErrorDisplayComponent } from './field-error-display/field-error-display.component';
import { BreadcrumbModule} from 'angular-crumbs';
import { SkeletonCourseCardComponent } from './skeleton-course-card/skeleton-course-card.component';
import { RealtimeService } from 'src/app/services/realtime.service';


@NgModule({
  declarations: [
    PathComponent,
    CourseCardComponent,
    FieldErrorDisplayComponent,
    SkeletonCourseCardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    NgxSkeletonLoaderModule
  ],
  exports: [
    PathComponent,
    CourseCardComponent,
    FieldErrorDisplayComponent,
    SkeletonCourseCardComponent
  ],
  providers:[
    RealtimeService,

  ]
})
export class SharedModuleModule { }
