import { CourseHomeworkComponent } from './views/course-homework/course-homework.component';
import { CourseDetailComponent } from './views/course-detail/course-detail.component';
import { AllCoursesComponent } from './views/all-courses/all-courses.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherCoursesComponent } from './views/teacher-courses/teacher-courses.component';
import { CourseResourcesComponent } from './views/course-resources/course-resources.component';
import { GroupDiscussComponent } from './views/group-discuss/group-discuss.component';
import { ChatGroupComponent } from './views/chat-group/chat-group.component';
import { CourseFormComponent } from './views/course-form/course-form.component';
import { LiveComponent } from './views/live/live.component';
import { ResourcesAsTeacherComponent } from './views/resources-as-teacher/resources-as-teacher.component';

const routes: Routes = [
  {
    path: 'courses',
    data: {
      breadcrumb: 'Courses',
    },
    children: [
      {
        path: '',
        component: AllCoursesComponent,
        data: { breadcrumb: null },
      },
      {
        path: 'teacher-courses/:id',
        component: TeacherCoursesComponent,
        data: { breadcrumb: 'TEACHER COURSES' },
      },
      {
        path: 'course-homework/:id',
        component: CourseHomeworkComponent,
        data: { breadcrumb: 'HOMEWORK DISCUSS' },
      },
      {
        path: 'course-detail/:id',
        data: { breadcrumb: 'COURSE DETAILES' },
        children: [
          {
            path: '',
            component: CourseDetailComponent,
            data: { breadcrumb: null },
          },
          {
            path: 'live',
            component: LiveComponent,
            data: { breadcrumb: 'Live' },
          },
        ]
      },
      {
        path: 'resources',
        component: CourseResourcesComponent,
        data: { breadcrumb: 'RESOURCE' },
      },
      {
        path: 'group-discuss',
        component: GroupDiscussComponent,
        data: { breadcrumb: 'HOMEWORK DISCUSS ' },
      },
      {
        path: 'chat-group/:id',
        component: ChatGroupComponent,
        data: { breadcrumb: 'DISCUSSION CHAT' },
      },
      {
        path: 'add',
        component: CourseFormComponent,
        data: { breadcrumb: 'Add' },
      },
      {
        path: 'edit/:courseId',
        component: CourseFormComponent,
        data: { breadcrumb: 'Edit' },
      },
      {
        path: 'teacher-resource',
        component: ResourcesAsTeacherComponent,
        data: { breadcrumb: 'TEACHER LIBRARY' },
      },
    ],
  },
];
export const CoursesRouteComponents = [
  CourseHomeworkComponent,
  CourseDetailComponent,
  AllCoursesComponent,
  TeacherCoursesComponent,
  CourseResourcesComponent,
  GroupDiscussComponent,
  ChatGroupComponent,
  CourseFormComponent,
  LiveComponent,
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule { }
