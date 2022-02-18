import { UserService } from 'src/app/components/login/user.service';
import { StorageService } from './../../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../profile/profile.service';
import { IUser } from 'src/app/entities/API-entities/user';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  user: IUser;
  activeId: number = 1;
  subscription: Subscription;
  constructor(
    private _router: Router,
    private _storageService: StorageService,
    private _profileService: ProfileService,
    private _userService: UserService
  ) {
    this.subscription = this._userService.localStorageUser.subscribe(data => {
      if (data) {
        this.user = data;
        console.warn("nav user", this.user);
        console.warn("nav data",data);
      }
    });
  }

  ngOnInit(): void {
    this.checkUsertoken();
     this.getUserObject();
    console.warn("nav user ngOnInit",this.user);
  }
   getUserObject() {
     this.user = this._storageService.getLocalObject('user');
   }
  checkUsertoken() {
    return this._storageService.getLocalObject('token') ? true : false;
  }
  categories() {
    this._router.navigateByUrl('category');
  }

  login() {
    this._router.navigateByUrl('login');
  }

  register() {
    this._router.navigateByUrl('register');
  }

  logout() {
    this._profileService.logout();
  }
}
