import { IResource } from './../../../entities/abstract-entities/resource';
import { ISolution } from './../../../entities/abstract-entities/solution';
import { IHomework } from './../../../entities/abstract-entities/homework';
import { IFolder } from './../../../entities/abstract-entities/folder';
import { CRUDService } from 'src/app/services/crud.service';
import { ICourse } from 'src/app/entities/API-entities/course';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export class AllCoursesActions extends CRUDService<ICourse> {
  constructor(http: HttpClient) {
    super(http, 'course');
  }

  readAllCourses(id:number,limit:number ,page:number): Observable<ICourse[]> {
    return this.readEntities( undefined,'/get'+'?category_id='+id+'&limit='+limit +'&page=' + page);
  }

  readCoursesDetail(id:number) {
    console.log('readCoursesDetail::',id)
    return this.readEntity(id,'');
  }
  
  readTeacherCourses(id:number, page: number){
    return this.readEntities(undefined, '/teacher/active'+ '?teacher_id=' + id +'&page=' + page);
  }
  readHomeworkCourse(id:number){
    return this.readEntities(undefined, '/homework/get/' + id );
  }

  readCourseFolders(id: number){
    return this.readEntities(undefined, '/folder/get/' + id);
  }
  readStudentCourse(id: number){
    return this.readEntities(undefined, '/user/getStudents/' + id);
  }
  deleteFolder(id: number){
    return this.deleteEntity(id, '/folder/delete' );
  }
  updateFolder(folder: any){
    return this.updateQueryEntity( folder, '/folder/update/'+ folder.id + '?name=' + folder.name );
  }
  createFolder(folder:any){
    return this.createEntity(folder,'/folder/create');
  }
  deleteResourceFile(id: number){
    return this.deleteEntity(id, '/resource/delete' );
  }
  createResourceFile(file: any){
    return this.createEntity(file,'/resource/create');
  }
}
