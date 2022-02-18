import { CRUDService } from 'src/app/services/crud.service';
import { IContact } from 'src/app/entities/API-entities/contact';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class ContactActions extends CRUDService<IContact> {
  constructor(http: HttpClient) {
    super(http, 'feedback/contact');
  }


  createContact(contact: IContact) {
   return this.createEntity(contact, '/create');
  }

}
