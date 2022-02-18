import { Component, OnInit } from '@angular/core';
import { IUserLogin } from './entities/abstract-entities/user-login';
import { IUser } from './entities/API-entities/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}
