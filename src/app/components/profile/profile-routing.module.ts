import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProfileComponent } from './views/view-profile/view-profile.component';
import { EditProfileComponent } from './views/edit-profile/edit-profile.component';
import { EditSubscriptionComponent } from './views/edit-subscription/edit-subscription.component';
import { EWalletComponent } from './views/e-wallet/e-wallet.component';

import { SubscriptionCoursesComponent } from './views/subscription-courses/subscription-courses.component';
import { GivenCoursesComponent } from './views/given-courses/given-courses.component';



const routes: Routes = [
  {
    path: 'profile',
    data: {
      breadcrumb: 'Profile'
    },
    children: [
      {
        path: '',
        component: ViewProfileComponent,
        data: {
          breadcrumb: null
        },
      },
      {
        path: 'edit',
        component: EditProfileComponent,
        data: {
          breadcrumb: 'Edit'
        },
      },
      {
        path: 'edit-subscription',
        component: EditSubscriptionComponent,
        data: {
          breadcrumb: 'Edit Subscription'
        },
      },
      {
        path: 'my-wallet',
        component: EWalletComponent,
        data: {
          breadcrumb: 'E-Wallet'
        },
      },
    ],
  },
  {
    path: 'subscriptionCourses',
    data: { breadcrumb: 'My Courses as student' },
    component:SubscriptionCoursesComponent
  },
  {
    path: 'GivenCourses',
    data: { breadcrumb: 'My Courses as teacher' },
    component:GivenCoursesComponent
  }
];
export const ProfileRouteComponents = [
  ViewProfileComponent,
  EditProfileComponent,
  EditSubscriptionComponent,
  EWalletComponent,
  SubscriptionCoursesComponent,
  GivenCoursesComponent
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
