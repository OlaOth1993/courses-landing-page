import { ProfileModule } from './components/profile/profile.module';
import { SharedModuleModule } from './components/shared/shared-module.module';
import { MainNavComponent } from './components/shared/main-nav/main-nav/main-nav.component';
import { CategoriesModule } from './components/category-module/category.module';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule, RoutesComponents } from './app-routing.module';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './interceptors/Auth/auth.interceptor';
import { ErrorInterceptor } from './interceptors/Error/error.interceptor';
import { LoggerInterceptor } from './interceptors/Logger/logger.interceptor';

import { NavComponent } from './components/shared/nav/nav.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DatePipe } from '@angular/common';
import { MainModule } from './components/main-module/main.module';
import { CommonModules } from './imports/common-modules';
import { ThirdPartyModules } from './imports/3rd-party-modules';
import { ToastsComponent } from './components/toasts/toasts.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoursesModule } from './components/courses/courses.module';
import { NgModel } from '@angular/forms';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
} from 'ng-social-login-module';
import { EmailVerifyDialogComponent } from './components/register/views/dialog/email-verify-dialog/email-verify-dialog.component';
import { RegisterComponent } from './components/register/views/index/register.component';
import { ConfirmEmailVerifyComponent } from './components/register/views/verify/confirm-email-verify/confirm-email-verify.component';
import { RealtimeService } from './services/realtime.service';

const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('220921703904-noih0144vikfquvj3sk30a6061ad9fbv.apps.googleusercontent.com')
  }
], true);

export function provideConfig() {
  return CONFIG;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RoutesComponents,
    NavComponent,
    MainNavComponent,
    ToastsComponent,
    EmailVerifyDialogComponent,
    ConfirmEmailVerifyComponent,
  ],
  imports: [
    SocialLoginModule,
    CommonModule,
    // NgbModal,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CategoriesModule,
    ProfileModule,
    CommonModules,
    ThirdPartyModules,
    MainModule,
    SharedModuleModule,
    CoursesModule,
    NgxFileDropModule,
    MatSelectCountryModule.forRoot('en'),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggerInterceptor,
      multi: true,
    },
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    DatePipe,
    NgbActiveModal,
    RealtimeService,

  ],
  exports: [TranslateModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
