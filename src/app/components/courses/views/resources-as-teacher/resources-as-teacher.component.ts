import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IFolder } from 'src/app/entities/abstract-entities/folder';
import { IResource } from 'src/app/entities/abstract-entities/resource';
import { CoursesService } from '../../courses.service';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { ToastService } from 'src/app/services/toast.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-resources-as-teacher',
  templateUrl: './resources-as-teacher.component.html',
  styleUrls: ['./resources-as-teacher.component.scss']
})
export class ResourcesAsTeacherComponent implements OnInit {
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
  course_id: number;
  folder_rename: IFolder;
  folder_id: number;
  constructor(
    private courseService: CoursesService,
    private datepipe: DatePipe,
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private _modalService: NgbModal,
    private _toastService: ToastService, 
    private storage: StorageService,


  ) {
    this.folderName = null;
    config.placement = 'bottom-left';
    config.autoClose = true;
    this.FileSaver = require('file-saver');
    this.isGrid = true;
    this.checkedFolders = false;
    this.checkedResources = false;
    this.isSelectAllChecked = false;
    this.isFolders = true;
    this.isResources = false;
    this.checkedNumber = 0;
    //  parameter must get from request
    this.userCourseId = 1;
  }

  ngOnInit(): void {
    this.userCourseId = this.storage.getLocalObject('teacher_course_id');
    this.getFolders(this.userCourseId);

  }

  getFolders(user_course_id: number): void {
    this.courseService.getCourseFolders(user_course_id).subscribe(
      (response: any) => {
        console.log(response);
        this.folders = response.data;
        this.folderListLength = this.folders.length;
      //  this.getDateFormat(this.folders, null);
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
   // this.getDateFormat(null, this.resources);
  }

  openResources(folder: IFolder): void {
    console.log(folder.id)
    this.folder_id = folder.id;
    let folders = document.getElementById('folders');
    folders.style.display = 'none';
    this.folderName = '>  ' + folder.name;
    this.isFolders = false;
    this.isResources = true;
    this.getResources(folder);
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
      this.showDownloadingFile();
      this.getCheckedResources();
      this.openDownloadModal(content);
      console.log('resourcesCheckedList', this.resourcesCheckedList);
      this.resourcesCheckedList.forEach((resource: IResource) => {
        this.downloadFile(resource, content);
      });
      this._toastService.toasts = [];
      this.showSuccessAdd();
    }
    if (this.isFolders) {
      this.showDownloadingFolder();
      this.getCheckedFolders();
     // this.openDownloadModal(content);
      console.log('foldersCheckedList', this.foldersCheckedList);
      this.foldersCheckedList.forEach((folder: IFolder) => {
        this.downloadFolder(folder, content);
      });
      this._toastService.toasts = [];
    }
  }

  downloadFolder(folder: IFolder , content): void {
    // if (!folder.isChecked) {
    //   this.openDownloadModal(content);
    // }
    this.showDownloadingFolder();

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
    this._toastService.toasts = [];

    this.foldersCheckedList = [];
  }

  downloadFile(resource: IResource, content): void {
    this.extension = resource.extension;
    if (!resource.isChecked) {
      this.openDownloadModal(content);
    }
    this.showDownloadingFile();
    resource.user_course_id = this.userCourseId;
    resource.resource_id = resource.id;
    this.courseService.download(resource).subscribe(
      (response) => {
        let blob = new Blob([response]);
        FileSaver.saveAs(blob, resource.file_name);
        this.closeDownloadModal();
        this.resourcesCheckedList = [];
        this._toastService.toasts = [];
        this.showSuccessAdd();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  deleteFolder(id:number){
    this.courseService.deleteFolders(id).subscribe(
      (response: any) => {
        console.log('res', response)
        this.folders = this.folders.filter(i => i.id !== id);
        console.log(" this.folders", this.folders);
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  deleteFile(id:number){
    this.courseService.deleteResource(id).subscribe(
      (response: any) => {
        console.log('res', response)
        this.resources = this.resources.filter(i => i.id !== id);
        console.log(" this.resources", this.resources);
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  openRenameFileModal(content, folder_rename: IFolder) {
   this.folder_rename = folder_rename;
    this.modalRef = this._modalService.open(content, { centered: true, windowClass : "myCustomModalClass"});
  }
  openAddFileModal(content){
    this.modalRef = this._modalService.open(content, { centered: true, windowClass : "myCustomModalClass"});

  }
  openAddFolderModal(content){
    this.course_id = 1;
    this.modalRef = this._modalService.open(content, { centered: true, windowClass : "myCustomModalClass"});

  }
  showSuccessAdd() {
    this._toastService.show(undefined, {
    icon: '../../../../../assets/icons/course-detail/homework-iocn.svg',
    title: 'Downloaded Successfully!',
    description: "You've just update your course information",
  });
}
showDownloadingFile() {
  this._toastService.show(undefined, {
    icon: 'assets/icons/loading-gif-transparent-2.gif',
    title: 'Your File is Downloading!',
    description: "please be patient",
  }, false);
}
showDownloadingFolder() {
  this._toastService.show(undefined, {
    icon: 'assets/icons/loading-gif-transparent-2.gif',
    title: 'Your Folder is Downloading!',
    description: "please wait",
  }, false);
}
}
