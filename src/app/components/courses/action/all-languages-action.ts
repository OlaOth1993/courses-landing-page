import { CRUDService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILanguage } from 'src/app/entities/API-entities/language';

export class LanguagesActions extends CRUDService<ILanguage> {
  constructor(http: HttpClient) {
    super(http, 'client/lang');
  }

  readAllLanguages():Observable<ILanguage[]>{
    return this.readEntities(undefined,'/get');
  }

}
