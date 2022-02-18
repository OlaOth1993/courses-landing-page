import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',

    data: {
      title: 'Home',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./../category-module/category.module').then(
            (m) => m.CategoriesModule
          ),
        data: { breadcrumb: 'CATEGORIES' },

      },

      {
        path: '',
        loadChildren: () =>
          import('../courses/courses.module').then(
            (m) => m.CoursesModule
          ),
        data: { breadcrumb: 'Courses' },

      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
