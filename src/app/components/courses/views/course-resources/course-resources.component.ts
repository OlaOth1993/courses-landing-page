import { IResource } from './../../../../entities/abstract-entities/resource';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IFolder } from 'src/app/entities/abstract-entities/folder';
import { CoursesService } from '../../courses.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
@Component({
  selector: 'app-course-resources',
  templateUrl: './course-resources.component.html',
  styleUrls: ['./course-resources.component.scss'],
})
export class CourseResourcesComponent implements OnInit {
  isGrid: boolean;
  byteArray: any;
  isList: boolean;
  checkedFolders: boolean;
  checkedResources: boolean;
  isSelectAllChecked: boolean;
  checkedNumber: number;
  folderListLength: number;
  resourceListLength: number;
  fileExtension: string;
  FileSaver: any;
  fileName: string;
  folders: IFolder[];
  folderName: string;
  isFolders: boolean;
  isResources: boolean;
  resources: IResource[];
  resourcesCheckedList: IResource[] = [];
  foldersCheckedList: IFolder[] = [];
  modalRef: NgbModalRef;
  extension: string;
  userCourseId: number;
  constructor(
    private courseService: CoursesService,
    private datepipe: DatePipe,
    private modalService: NgbModal
  ) {
    this.FileSaver = require('file-saver');
    this.isGrid = true;
    this.checkedFolders = false;
    this.checkedResources = false;
    this.isSelectAllChecked = false;
    this.isFolders = true;
    this.isResources = false;
    this.checkedNumber = 0;
    //  parameter must get from request
    this.userCourseId = 3;
  }

  ngOnInit(): void {
    this.getFolders(this.userCourseId);
  }

  getFolders(user_course_id: number): void {
    this.courseService.getCourseFolders(user_course_id).subscribe(
      (response: any) => {
        console.log(response);
        this.folders = response.data;
        this.folderListLength = this.folders.length;
        this.getDateFormat(this.folders, null);
        console.log('folders', this.folders);
      },
      //  ! component scope error handling
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }

  getResources(folder: IFolder): void {
    this.checkedFolders = false;
    this.checkedNumber = 0;
    this.resources = folder.resources;
    this.resourceListLength = this.resources.length;
    this.setDefaultFolderValues();
    this.getFileExtension();
    this.getFileName();
    this.getDateFormat(null, this.resources);
  }

  openResources(folder: IFolder): void {
    let folders = document.getElementById('folders');
    folders.style.display = 'none';
    this.folderName = '> ' + folder.name;
    this.isFolders = false;
    this.isResources = true;
    this.getResources(folder);
  }

  getDateFormat(folders: IFolder[], resources: IResource[]): void {
    if (folders) {
      folders.forEach((folder: IFolder) => {
        folder.created_at = this.datepipe.transform(
          folder.created_at,
          'dd MMMM h:mm a'
        );
      });
    }
    if (resources) {
      resources.forEach((resource: IResource) => {
        resource.created_at = this.datepipe.transform(
          resource.created_at,
          'dd MMMM h:mm a'
        );
      });
    }
  }

  Grid(): void {
    this.isGrid = true;
    this.isList = false;
  }

  List(): void {
    this.isList = true;
    this.isGrid = false;
  }

  isChecked(resource: IResource, folder: IFolder): void {
    if (folder) {
      folder.isChecked = !folder.isChecked;
      if (folder.isChecked) {
        this.checkedFolders = true;
        this.checkedNumber += 1;
      } else {
        this.checkedNumber -= 1;
        this.isSelectAllChecked = false;
        if (this.checkedNumber === 0) {
          this.checkedFolders = false;
        }
      }
    }
    if (resource) {
      resource.isChecked = !resource.isChecked;
      if (resource.isChecked) {
        this.checkedResources = true;
        this.checkedNumber += 1;
      } else {
        this.checkedNumber -= 1;
        this.isSelectAllChecked = false;
        if (this.checkedNumber === 0) {
          this.checkedResources = false;
        }
      }
    }
  }

  goBack(): void {
    this.isResources = false;
    this.isFolders = true;
    this.folderName = '';
  }

  selectAll(): void {
    this.isSelectAllChecked = !this.isSelectAllChecked;
    if (this.isFolders) {
      this.checkedNumber = this.folders.length;
      this.folders.forEach((folder: IFolder) => {
        if (this.isSelectAllChecked) {
          folder.isChecked = true;
        } else {
          folder.isChecked = false;
          this.checkedFolders = false;
          this.checkedNumber = 0;
        }
      });
    }
    if (this.isResources) {
      this.checkedNumber = this.resources.length;
      this.resources.forEach((resource: IResource) => {
        if (this.isSelectAllChecked) {
          resource.isChecked = true;
        } else {
          resource.isChecked = false;
          this.checkedResources = false;
          this.checkedNumber = 0;
        }
      });
    }
  }

  setDefaultFolderValues(): void {
    this.folders.forEach((folder: IFolder) => {
      folder.isChecked = false;
      folder.downloadPop = false;
    });
  }

  getFileExtension(): void {
    this.resources.forEach((resource: IResource) => {
      resource.extension = resource.url.split('.').pop();
      this.fileName = resource.name + '.' + resource.extension;
    });
  }

  getFileName(): void {
    this.resources.forEach((resource: IResource) => {
      resource.file_name = resource.url.split('/').pop();
      resource.file_name = resource.name + '.' + resource.extension;
    });
  }

  openDownloadModal(content): void {
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  closeDownloadModal(): void {
    this.modalRef.close();
  }

  getCheckedResources(): void {
    this.resources.forEach((resource: IResource) => {
      if (resource.isChecked) {
        this.resourcesCheckedList.push(resource);
      }
    });
  }

  getCheckedFolders(): void {
    this.folders.forEach((folder: IFolder) => {
      if (folder.isChecked) {
        this.foldersCheckedList.push(folder);
      }
    });
  }

  downloadSelected(content): void {
    if (this.isResources) {
      this.getCheckedResources();
      this.openDownloadModal(content);
      console.log('resourcesCheckedList', this.resourcesCheckedList);
      this.resourcesCheckedList.forEach((resource: IResource) => {
        this.downloadFile(resource, content);
      });
    }
    if (this.isFolders) {
      this.getCheckedFolders();
     // this.openDownloadModal(content);
      console.log('foldersCheckedList', this.foldersCheckedList);
      this.foldersCheckedList.forEach((folder: IFolder) => {
        this.downloadFolder(folder, content);
      });
    }
  }

  downloadFolder(folder: IFolder , content): void {
    // if (!folder.isChecked) {
    //   this.openDownloadModal(content);
    // }
    this.getResources(folder);
    let length = this.resources.length;
    console.log('folder res' , this.resources);
    let zip = new JSZip();
    let count = 0;
    this.resources.forEach((resource: IResource) => {
      resource.user_course_id = this.userCourseId;
      resource.resource_id = resource.id;
      this.courseService.download(resource).subscribe((response) => {
        console.log('res', response);
        let blob = new Blob([response]);
        zip.file(resource.file_name, blob);
        count++;
        console.log('count' , count);
        if (length === count) {

          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, folder.name + '.zip');
          });
        }
      });
    });
    this.foldersCheckedList = [];
  }

  downloadFile(resource: IResource, content): void {
    this.extension = resource.extension;
    if (!resource.isChecked) {
      this.openDownloadModal(content);
    }
    resource.user_course_id = this.userCourseId;
    resource.resource_id = resource.id;
    this.courseService.download(resource).subscribe(
      (response) => {
        let blob = new Blob([response]);
        FileSaver.saveAs(blob, resource.file_name);
        this.closeDownloadModal();
        this.resourcesCheckedList = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
