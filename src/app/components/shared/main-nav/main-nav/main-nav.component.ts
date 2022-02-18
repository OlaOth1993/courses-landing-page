import { UserService } from 'src/app/components/login/user.service';
import { StorageService } from './../../../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { ProfileService } from '../../../profile/profile.service';
import { IUser } from 'src/app/entities/API-entities/user';
import { Subscription } from 'rxjs';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from 'src/app/components/courses/courses.service';
import { HttpErrorResponse } from '@angular/common/http';
import { INotification } from 'src/app/entities/API-entities/notification';
import { RealtimeService } from 'src/app/services/realtime.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],

})
export class MainNavComponent implements OnInit {
  isSearchRout: boolean;
  user: IUser;
  subscription: Subscription;
  notification: INotification[] = [];
  public _subscription: Subscription;
  constructor(
    private _profileService: ProfileService,
    private _storageService: StorageService,
    private _userService: UserService,
    public router: Router,
    public config: NgbDropdownConfig,
    public _cousreService: CoursesService,
    private _realTimeService: RealtimeService,
  ) {

    this._subscription = this._realTimeService.subjectItem.subscribe((data: any) => {
      console.warn("data", data)
    });

    this.listenToChannels();

    config.placement = 'bottom-left';
    config.autoClose = true;
    this.isSearchRout = false;
    this.router.events.subscribe((e: RouterEvent) => {
      if (e.url == '/search') {
        this.isSearchRout = true;
      } else {
        this.isSearchRout = false;
      }
    });
    this.subscription = this._userService.localStorageUser.subscribe(data => {
      if (data) {
        this.user = data;
      }
    });

  }

  ngOnInit(): void {
    this.getUserObject();
    this.getNotification();

    // this.listenToChannels();
  }
  getUserObject() {
    this.user = this._storageService.getLocalObject('user');
  }
  checkUsertoken() {
    return this._storageService.getLocalObject('token') ? true : false;
  }
  Search() {
    this.router.navigateByUrl('/search');
  }
  login() {
    this.router.navigateByUrl('login');
  }

  register() {
    this.router.navigateByUrl('register');
  }
  logout() {
    this._profileService.logout();
    this.router.navigateByUrl('/');
  }
  getNotification() {
    this._cousreService.getNotification().subscribe(
      (response: any) => {
        console.log("response", response);
        this.notification = response.data;
        console.log(" this.notification", this.notification)
      },
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }

  listenToChannels() {
    this._realTimeService.listenToChanel("test-channel", "test-event");
    /*     this._realTimeService.listenToChanel("private-channel-course.1", "solve-homework-event");
        this._realTimeService.listenToChanel("private-channel-course.1", "rate-course-event");
        this._realTimeService.listenToChanel("private-channel-course.1","start-session-event");
     */
  }
  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
