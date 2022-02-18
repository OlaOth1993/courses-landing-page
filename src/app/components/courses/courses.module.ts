import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRoutingModule, CoursesRouteComponents } from './courses-routing.module';
import { SharedModuleModule } from '../shared/shared-module.module';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { HomeworkFileFormComponent } from './views/homework-file-form/homework-file-form.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AddReplyFormComponent } from './views/add-reply-form/add-reply-form.component';
import { ThirdPartyModules } from 'src/app/imports/3rd-party-modules';
import { ResourcesAsTeacherComponent } from './views/resources-as-teacher/resources-as-teacher.component';
import { RenameFolderFormComponent } from './views/rename-folder-form/rename-folder-form.component';
import { AddFileFormComponent } from './views/add-file-form/add-file-form.component';
import { AddFolderFormComponent } from './views/add-folder-form/add-folder-form.component';
//import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NgxAgoraModule, AgoraConfig } from 'ngx-agora';
import { NgProgressModule } from 'ngx-progressbar';
import { RTMComponent } from './views/rtm/rtm.component';

const agoraConfig: AgoraConfig = {
  AppID: '7c3d832ea19b440abda7c1a015f82251',
};

@NgModule({
  declarations: [
    CoursesRouteComponents,
    HomeworkFileFormComponent,
    AddReplyFormComponent,
    ResourcesAsTeacherComponent,
    RenameFolderFormComponent,
    AddFileFormComponent,
    AddFolderFormComponent,
    RTMComponent,
  ],
  imports: [
    ThirdPartyModules,
    CommonModule,
    CoursesRoutingModule,
    SharedModuleModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    NgxFileDropModule,
    NgxAgoraModule.forRoot(agoraConfig)
    // MDBBootstrapModule.forRoot()
  ],
  providers: [
    NgbActiveModal
  ]
})
export class CoursesModule { }
