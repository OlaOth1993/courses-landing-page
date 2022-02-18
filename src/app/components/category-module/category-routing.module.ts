import { SubCategoryComponent } from './views/sub-category/sub-category.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './views/category/category.component';
import { SubcategoryComponent } from './views/subcategory/subcategory.component';

const routes: Routes = [
  {
    path: 'category',
    data: {
      breadcrumb: 'Categories',
    },
    children: [
      {
        path: '',
        component: CategoryComponent,

      },
      {
        path: 'subCategory',
        component: SubCategoryComponent,
        data: { breadcrumb: 'SUBCATEGORY' },

      },
      {
        path: 'sub-category',
        component: SubcategoryComponent,
        data: { breadcrumb: 'SUBCATEGORY' },

      },
    ],
  },

];

export const RoutesComponents = [CategoryComponent, SubCategoryComponent];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule { }
