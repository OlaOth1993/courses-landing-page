import { MatTabsModule } from '@angular/material/tabs';
import { SharedModuleModule } from './../shared/shared-module.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryRoutingModule, RoutesComponents } from './category-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import {NgbPaginationModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { SubcategoryComponent } from './views/subcategory/subcategory.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// For MDB Angular Free
/* import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { MDBBootstrapModulesPro, MDBSpinningPreloader } from 'ng-uikit-pro-standard'; */

@NgModule({
  declarations: [RoutesComponents, SubcategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModuleModule,
    MatTabsModule,
    TabsModule,
    MdbTabsModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbModule
   // Ng2CarouselamosModule
  ],
})
export class CategoriesModule {}
