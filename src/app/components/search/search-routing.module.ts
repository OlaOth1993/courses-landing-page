import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './views/search/search.component';

const routes: Routes = [
  {
    path: '',
    data: { title: '' },
    children: [
      {
        path: '',
        component: SearchComponent,
      },

    ],
  },
];
export const SearchRouteComponents = [SearchComponent];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SearchRoutingModule { }
