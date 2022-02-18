import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verify-dialog',
  templateUrl: './email-verify-dialog.component.html',
  styleUrls: ['./email-verify-dialog.component.scss']
})
export class EmailVerifyDialogComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  goToHome() {
    this._router.navigate(['/confirm-email']);
  }

}
