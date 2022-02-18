import { promise } from 'protractor';
import { Inject, Injectable } from '@angular/core';
import { Subject, Observable ,BehaviorSubject} from 'rxjs';
import Pusher from 'pusher-js'
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private pusher: any;
 private channell : any;
  private token: any;
  private course_id :number;
  subject = new BehaviorSubject('null');
  subjectItem = this.subject.asObservable();

  constructor(private _storage: StorageService,

  ) {
     this.token = this._storage.getToken();
     this.course_id = this._storage.getLocalObject('course_id');

    this.pusher = new Pusher('775c7c1b188537913710',  {
      authEndpoint: 'https://scholarlive.404developers.com/broadcasting/auth',
      cluster: 'us2',
      auth: {
        
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.token
        }
      }
    });
    /* console.log(this.pusher)
    this.channel = this.pusher.subscribe("test-channel" );
    
    console.log("this.pusher.subscribe",this.pusher.subscribe("test-channel" )); */
    //this.channell = this.pusher.subscribe("test-channel" );
    this.channell = this.pusher.subscribe("private-channel-course."+1 );
    console.log('channnnnel',this.channell)

    // this.listenToChanel("private-channel-course."+1, "add-homework-event");

  }

  listenToChanel(name: string, event: string) {
    var channel = this.pusher.subscribe("private-channel-course."+1  );
    channel.bind(event, (data) => {
      this.subject.next(data);
      this.subject.next(null);
      console.log('data111',data)
    });
    console.log("name:",name , ",event:",event)

  }
}