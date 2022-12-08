import { Injectable } from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private http: HttpClient
  ) { }


  getAll(): Observable<any> {
    return this.http.get(
      'https://alte-angular-2-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      {
        params: {
          'orderBy': '"title"',
        },
        // observe: 'events',
        observe: 'body',
        // responseType: 'text'
      }
      )
      .pipe(
        tap((data: any) => {
          // console.log(data);
          if (data.type === HttpEventType.Sent) {
            // console.log('start');
          }
          if (data.type === HttpEventType.Response) {
            // console.log('end');
          }
        }),
        map((data: any) => {
          return Object.keys(data).map(key => ({
            ...data[key],
            id: key
          }))
        })
      );
  }

  create(data: any): Observable<any> {
    return this.http.post(
      'https://alte-angular-2-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      data
    )
  }

  update(data: any): Observable<any> {
    return this.http.put(
      `https://alte-angular-2-default-rtdb.europe-west1.firebasedatabase.app/posts/${data.id}.json`,
      {
        title: data.title,
        body: data.body
      }
    )
  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      `https://alte-angular-2-default-rtdb.europe-west1.firebasedatabase.app/posts/${id}.json`
    )
  }

  statusChange(id: string, status: boolean): Observable<any> {
    return this.http.patch(
      `https://alte-angular-2-default-rtdb.europe-west1.firebasedatabase.app/posts/${id}.json`,
      {
        status
      }
    )
  }
}
