import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserModel } from 'src/app/entities/abstract-entities/user-model';
import { CRUDService } from 'src/app/services/crud.service';

export class UtilityActions extends CRUDService<IUserModel> {
  constructor(http: HttpClient) {
    super(http, 'client/auth');
  }

  createRegister(user: IUserModel): Observable<any> {
    return this.createEntity(user, '/register');
  }

  sendEmail() {
    return this.readEntities(undefined, '/requestEmailVerification');
  }

  EmailCode(form) {
    return this.readEntities(form, '/confirmEmail');
  }
}
