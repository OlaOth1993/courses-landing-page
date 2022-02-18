import { CRUDService } from 'src/app/services/crud.service';
import { ILanguage } from '../entities/abstract-entities/language';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class LanguageActions extends CRUDService<ILanguage> {
  constructor(http: HttpClient) {
    super(http, 'client/lang');
  }


  readLanguages(): Observable<ILanguage[]> {
   return this.readEntities(undefined, '/get');
  }

}
