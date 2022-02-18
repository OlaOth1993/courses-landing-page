import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThirdPartyModules } from '../../imports/3rd-party-modules';
import { CommonModules } from '../../imports/common-modules';
import { ProfileRoutingModule , ProfileRouteComponents} from './profile-routing.module';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { PasswordFormComponent } from './views/password-form/password-form.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ProfileRouteComponents,
    PasswordFormComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NgbModule,
    ThirdPartyModules,
    CommonModules,
    MatSelectCountryModule,
  ],
  providers: [
    NgbActiveModal,
  ],
})
export class ProfileModule { }
