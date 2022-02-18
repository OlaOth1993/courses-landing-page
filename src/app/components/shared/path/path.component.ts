import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { BreadcrumbService, Breadcrumb } from 'angular-crumbs';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss'],
  // encapsulation: ViewEncapsulation.None

})
export class PathComponent implements OnInit {
  @Input() title: string;
  @Input() path: string;
  menuItems: MenuItem[];

  breadcrumbs: MenuItem[];
  // readonly home = { icon: 'pi pi-home', url: '/' };

  constructor(
    public router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
  }

  ngOnInit(): void {
    this.subscribeToBreadcrumb();
  }
  subscribeToBreadcrumb() {
    this.breadcrumbService.breadcrumbChanged.subscribe((crumbs) => {
      this.breadcrumbs = crumbs.map((c) => this.toPrimeNgMenuItem(c));
      console.warn('this.breadcrumbs', this.breadcrumbs);
    });
  }
  private toPrimeNgMenuItem(crumb: Breadcrumb) {
    return <MenuItem>{ label: crumb.displayName, url: `#${crumb.url}` };
  }
  handleBreadCrumb(url) {
    this.router.navigateByUrl(url);
  }
}
