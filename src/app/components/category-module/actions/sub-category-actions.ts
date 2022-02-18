import { CRUDService } from 'src/app/services/crud.service';
import { ICategory } from 'src/app/entities/API-entities/category';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class SubCategoryActions extends CRUDService<ICategory> {
  constructor(http: HttpClient) {
    super(http, 'course/category');
  }

  createSubCategory(subCategory: ICategory) {
    this.createEntity(subCategory, '/create');
  }

  readCategories(): Observable<ICategory[]> {
    return this.readEntities(undefined, '/all');
  }

  readSubCategories(id: number){
    return this.readEntities( undefined, '/sub?' + 'category_id=' + id);
  }

  updateCategory(subCategory: ICategory) {
    this.updateEntity(subCategory.id, subCategory, '/update');
  }

  deleteCategory(subCategory: ICategory) {
    this.deleteEntity(subCategory.id, '/delete');
  }
}
