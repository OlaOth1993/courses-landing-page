import { StorageService } from './../../services/storage.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IUserModel } from 'src/app/entities/abstract-entities/user-model';
import { IUser } from '../../entities/API-entities/user';
import { AuthActions } from './actions/auth-actions';
import { UtilityActions } from './actions/utility-actions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userLogin: AuthActions;
  user: UtilityActions;
  localStorageUser = new Subject<IUser>();
  constructor(http: HttpClient, private _storageService: StorageService) {
    this.userLogin = new AuthActions(http);
    this.user = new UtilityActions(http);
  }


  login(userLogin: IUserModel): Observable<IUser> {
    return this.userLogin.createLogin(userLogin);
  }

  register(user: IUserModel): Observable<IUser> {
    return this.user.createRegister(user);
  }
  setLocalStorageUser(user: IUser) {
    this._storageService.setLocalObject('user', user);
    this.localStorageUser.next(user);
  }
  getUser(): Observable<any> {
    return this.localStorageUser.asObservable();
  }
  logout() {
    this._storageService.removeToken();
    this._storageService.removeLocalObject('user');
    this.localStorageUser.next(null);
  }

  sendVerifyEmail() {
    return this.user.sendEmail();
  }

  confirmEmailCode(form) {
    return this.user.EmailCode(form);
  }

  signUpGoogle(form): Observable<IUser> {
    return this.userLogin.loginWithGoogle(form);
  }

}
