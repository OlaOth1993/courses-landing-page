import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export class CRUDService<T> {
  protected readonly apiURL: string;
  constructor(
    private http: HttpClient,
    protected readonly entityname: string,
    protected readonly baseURL: string = environment.baseUrl
  ) {
    this.apiURL = `${this.baseURL}/${this.entityname}`;
  }

  createEntity(body: T, apiExtension?: string): Observable<T> {
    return this.http.post<T>(this.apiURL + apiExtension, body);
  }
  createEntityDownload(body: T, apiExtension?: string): Observable<ArrayBuffer> {
    return this.http.post(this.apiURL + apiExtension, body, { responseType: 'arraybuffer' });
  }

  readEntities(query?: { [key: string]: string }, apiExtension?: string): Observable<T[]> {
    const params = new HttpParams({ fromObject: query });
    return this.http.get<T[]>(this.apiURL + apiExtension, { params });
  }

  readEntity(id: number, apiExtension?: string): Observable<T> {
    const url = this.joinEntityUrl(id, apiExtension);
    return this.http.get<T>(url);
  }

  updateEntity(id: number, body: T, apiExtension?: string): Observable<T> {
    const url = this.joinEntityUrl(id, apiExtension);
    return this.http.put<T>(this.apiURL + url, body);
  }

  updateQueryEntity(query?: { [key: string]: string }, apiExtension?: string): Observable<T[]> {
    // const params = new HttpParams({ fromObject: query });
    return this.http.put<T[]>(this.apiURL + apiExtension, query);
  };

  deleteEntity(id: number, apiExtension?: string): Observable<T> {
    const url = this.joinEntityUrl(id, apiExtension);
    return this.http.delete<T>(url);
  }

  protected joinEntityUrl(id: number, apiExtension?: string): string {
    return id ? [this.apiURL + apiExtension, id].join('/') : [this.apiURL + apiExtension].join('/');
  }
}
