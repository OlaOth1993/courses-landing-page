import { NgModule } from '@angular/core';

import { HomeComponent } from './components/home/home.component';
import { MainComponent } from './components/main-module/views/main/main.component';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/view/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/views/index/register.component';
import { ConfirmEmailVerifyComponent } from './components/register/views/verify/confirm-email-verify/confirm-email-verify.component';

/* import { AuthGuard } from './guards/auth.guard';
 */
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: 'confirm-email',
    component: ConfirmEmailVerifyComponent,
    //canActivate:[AuthGuard]
  },
  {
    path: '',
    component: HomeComponent,
    data: {
      breadcrumb: 'Home',
    },
  },

  {
    path: '',
    component: MainComponent,
    data: {
      breadcrumb: 'Home',
    },

    children: [
      // {
      //   path: '',
      //   redirectTo: '',
      //   pathMatch: 'full',
      // },

      {
        path: '',
        loadChildren: () =>
          import('./components/main-module/main.module').then(
            (m) => m.MainModule
          ),
      },
      {
        path: '',
        loadChildren: () =>
          import('./components/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./components/search/search.module').then(
            (m) => m.SearchModule
          ),
      },
      // {
      //   path: 'category',
      //   loadChildren: () =>
      //     import('./components/category-module/category.module').then(
      //       (m) => m.CategoriesModule
      //     ),
      // },

      // {
      //   path: 'course',
      //   loadChildren: () =>
      //     import('./components/course-module/course-module.module').then(
      //       (m) => m.CourseModuleModule
      //     ),
      // },
    ],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

export const RoutesComponents = [
  HomeComponent,
  MainComponent,
  LoginComponent,
  RegisterComponent,
  NotFoundComponent

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
