import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/components/login/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { EmailVerifyDialogComponent } from '../../dialog/email-verify-dialog/email-verify-dialog.component';

@Component({
  selector: 'app-confirm-email-verify',
  templateUrl: './confirm-email-verify.component.html',
  styleUrls: ['./confirm-email-verify.component.scss']
})
export class ConfirmEmailVerifyComponent implements OnInit {

  userEmail: string;
  codeInput: string[];

  errorMessage = "";

  loading: boolean = false;

  constructor(
    private _storageService: StorageService,
    private _userService: UserService,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this.userEmail = this._storageService.getLocalObject('user')['email'];
    this.codeInput = [undefined, undefined, undefined, undefined, undefined, undefined];
  }

  ngOnInit(): void {
  }

  SendVerify() {
    this.loading = true;
    this._userService
      .sendVerifyEmail()
      .pipe(finalize(() => this.loading = false))
      .subscribe((response: any) => {
        this.errorMessage = "";
        this._dialog.open(EmailVerifyDialogComponent);
      }, (error: HttpErrorResponse) => {
        if (error.status == 440) {
          this.errorMessage = error.error.message;
        }
      });
  }


  Submit() {
    if (!this.codeInput.includes(undefined)) {
      var codeValue = ""; for (let index = 0; index < this.codeInput.length; index++) codeValue += this.codeInput[index];
      let query: { code: string, email: string } = {
        code: codeValue,
        email: this.userEmail
      };
      this.loading = true;
      this._userService.confirmEmailCode(query).pipe(finalize(() => this.loading = false)).subscribe((response: any) => {
        this._router.navigate(['/']);
      }, (error: HttpErrorResponse) => {
        if (error.status == 550) {
          this.errorMessage = "your code verifcation is wrong or resend code";
        }
      });
    } else {
      this.errorMessage = "please fill the inputs with your code";
    }

  }

}
