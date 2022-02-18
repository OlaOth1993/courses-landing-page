import { CRUDService } from 'src/app/services/crud.service';
import { ICategory } from 'src/app/entities/API-entities/category';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class CategoryActions extends CRUDService<ICategory> {
  constructor(http: HttpClient) {
    super(http, 'course/category');
  }

  createCategory(category: ICategory) {
    this.createEntity(category, '/create');
  }

  readCategories(): Observable<ICategory[]> {
    return this.readEntities(undefined, '');
  }

  updateCategory(category: ICategory) {
    this.updateEntity(category.id, category, '/update');
  }

  deleteCategory(category: ICategory) {
    this.deleteEntity(category.id, '/delete');
  }
}
