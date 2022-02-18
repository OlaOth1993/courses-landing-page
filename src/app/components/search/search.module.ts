import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonModules } from '../../imports/common-modules';
import { ThirdPartyModules } from '../../imports/3rd-party-modules';
import { SearchRoutingModule, SearchRouteComponents } from './search-routing.module';





@NgModule({
  declarations: [SearchRouteComponents],
  imports: [
    CommonModule,
    SearchRoutingModule,
    CommonModules,
    ThirdPartyModules,
  ]
})
export class SearchModule { }
