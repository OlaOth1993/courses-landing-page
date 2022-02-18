import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUserModel } from 'src/app/entities/abstract-entities/user-model';
import { CRUDService } from 'src/app/services/crud.service';

export class AuthActions extends CRUDService<IUserModel> {
  constructor(http: HttpClient) {
    super(http, 'client/auth');
  }

  createLogin(user: IUserModel): Observable<any> {
    return this.createEntity(user, '/login');
  }

  loginWithGoogle(form: any): Observable<any> {
    return this.createEntity(form, '/login/service');
  }
}
