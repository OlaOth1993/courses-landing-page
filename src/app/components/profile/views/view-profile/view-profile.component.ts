import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from './../../profile.service';
import { IUser } from './../../../../entities/API-entities/user';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit {
  modalRef: NgbModalRef;
  user: IUser;
  percentage: number;
  info_completed: boolean;
  course_added: boolean;

  constructor(
    private _profileService: ProfileService,
    private _modalService: NgbModal,
    private _router: Router,
    public storageService:StorageService
  ) {
    this.info_completed, (this.course_added = false);
  }

  ngOnInit(): void {
    this.getProfileInfo();
  }
  getProfileInfo() {
    this._profileService.getUsernfo().subscribe((response: any) => {
      console.warn('profile', response.data);
      this.user = response.data;

      this.calculatePercentageInfo();
    });
  }

  calculatePercentageInfo() {
    let basicInf = ['full_name', 'email', 'profile_img', 'gender', 'birthday'];
    let filledInfo = this.calculateFilledInfo(basicInf);
    this.percentage = (filledInfo * 100) / basicInf.length;
  }

  calculateFilledInfo(basicInf: any) {
    let filledInfo = 0;
    Object.keys(this.user).forEach((key) => {
      if (basicInf.includes(key)) {
        if (this.user[key]) filledInfo++;
      }
    });
    return filledInfo;
  }
  completInfo() {
    console.warn(this.percentage);
    this.percentage < 100
      ? this._router.navigateByUrl('/profile/edit')
      : this._router.navigateByUrl('/courses/add');
  }
  openPasswordModal(content) {
    this.modalRef = this._modalService.open(content, { centered: true });
  }
  logout() {
    this._profileService.logout();
    this._router.navigateByUrl('/');
  }
}
