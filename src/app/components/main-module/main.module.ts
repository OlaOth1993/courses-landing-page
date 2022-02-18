import { CategoriesModule } from '../category-module/category.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { CoursesModule} from '../courses/courses.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    CoursesModule,
    CategoriesModule,
  ],
})
export class MainModule {
}
