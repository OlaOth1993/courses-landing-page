import { IUser } from './../entities/API-entities/user';
import { CRUDService } from 'src/app/services/crud.service';
import { IUserModel } from 'src/app/entities/abstract-entities/user-model';
import { HttpClient } from '@angular/common/http';
export class ClientActions extends CRUDService<IUserModel> {
  constructor(http: HttpClient) {
    super(http, 'client');
  }
  readUser() {
    return this.readEntity(undefined, '/user');
  }
  readUserProfile(id: number) {
    return this.readEntity(id, '/showUserprofile');
  }

  updateUserProfile(user: IUserModel) {
    return this.updateEntity(undefined, user, '/editProfile');
  }

  changePassword(password: any) {
    return this.updateEntity(undefined, password, '/changePassword');
  }

  uploadFile(file: any) {
    return this.createEntity(file, '/uploadFile');
  }

  uploadVideo(file: any) {
    return this.createEntity(file, '/uploadVideo');
  }
  downlodFile(resourse: any){
    return this.createEntityDownload(resourse, '/download');
  }
  getNotification(){
    return this.readEntities(undefined, '/notification/get');
  }
}
