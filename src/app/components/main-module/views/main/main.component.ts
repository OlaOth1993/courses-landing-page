import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isLiveRout: boolean;

  constructor(public router: Router) {
    this.isLiveRout = false;
    this.router.events.subscribe((e: RouterEvent) => {
      var url = e.url;
      if (url) {
        e.url.includes('live') ? this.isLiveRout = true : this.isLiveRout = false;
      }
    });
  }

  ngOnInit(): void {
  }

}
