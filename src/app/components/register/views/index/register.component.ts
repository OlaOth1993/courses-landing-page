import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IUserModel } from 'src/app/entities/abstract-entities/user-model';
import { IUser } from 'src/app/entities/API-entities/user';
import { StorageService } from 'src/app/services/storage.service';
import { ValidationService } from 'src/app/services/validation.service';
import { AuthService, GoogleLoginProvider } from 'ng-social-login-module';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/components/login/user.service';
import { EmailVerifyDialogComponent } from '../dialog/email-verify-dialog/email-verify-dialog.component';



@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
  animations: [

    trigger('stateInput', [

      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),

      transition('void=>*', [style({
        opacity: 0,
        transform: 'translateX(-200px)'
      }), animate(500)])

    ]),

    trigger('inputFade', [

      state('in', style({
        opacity: 1,
      })),

      transition('void=>*', [style({
        opacity: 0,
      }), animate('1s ease-in-out')])

    ]),

    trigger('btnAnimateSubmit', [

      state('in', style({
        opacity: 1,
        transform: 'translate(0,0)'
      })),

      transition('void=>*', [style({
        opacity: 0,
        transform: ' translate(-470px, 50px)'
      }), animate(500)])
    ]),

    trigger('socialMedia', [

      state('in', style({
        opacity: 1,
        transform: 'translate(0,0)'
      })),

      transition('void=>*', [style({
        opacity: 0,
        transform: 'translate(-500px, -70px)'
      }), animate(500)])
    ])

  ],
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  user: IUserModel;
  userData: IUser;

  formSubmit: boolean = false;

  formSubscription: Subscription;

  state = "out"

  loading: boolean = false;

  hidePassword: boolean = true;
  hideConfirm: boolean = true;

  constructor(
    private _validationService: ValidationService,
    private _storageService: StorageService,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _router: Router,
    private _authService: AuthService,
    private _dialog: MatDialog
  ) {
    this.InitialForm();
    this.state = "in";
  }

  ngOnInit(): void {

    this.InitialForm();
    this.SubscripeForm();

  }


  InitialForm() {
    this.registerForm = this._formBuilder.group({
      'full_name': [null, [Validators.required, this.CheckSpace]],
      'email': [null, [Validators.required, Validators.email]],
      'password': [null, Validators.required],
      'confirm': [null, Validators.required]
    }, {
      validator: this.ComparePassword("password", "confirm")
    });
    this._validationService.formSubject.next({ form: this.registerForm, submit: this.formSubmit });
  }

  SubscripeForm() {
    this.formSubscription = this.registerForm.valueChanges.subscribe(() => {
      this._validationService.formSubject.next({ form: this.registerForm, submit: this.formSubmit });
    })
  }


  onSubmit(formData) {
    this.formSubmit = true;
    console.log(this.registerForm);
    if (this.registerForm.valid) {
      this.loading = true;
      delete formData['confirm']
      this.user = formData;

      this._userService.register(this.user).pipe(finalize(() => this.loading = false)).subscribe((response: any) => {
        this.saveUser(response.data);

        //dialog send request

        this.loading = true;

        this._userService.sendVerifyEmail().pipe(finalize(() => this.loading = false)).subscribe((response: any) => {
          this._dialog.open(EmailVerifyDialogComponent);
        });

      },
        error => {
          if (error.status == 420) {
            this.registerForm.get('email').setErrors({ emailExsit: true });
            this._validationService.validateAllFormFields(this.registerForm);
            this._validationService.formSubject.next({ form: this.registerForm, submit: this.formSubmit });
          }
        });


    } else {
      this._validationService.validateAllFormFields(this.registerForm);
      this._validationService.formSubject.next({ form: this.registerForm, submit: this.formSubmit });
    }
  }

  saveUser(user: IUser) {
    this.userData = user;
    console.warn('User from response', this.userData);
    this._storageService.setToken(this.userData.token);
    console.warn('User from local storage', this._storageService.getLocalObject('user'));
    this._storageService.setLocalObject('user', this.userData);
    console.warn('Token from local storage', this._storageService.getToken());
  }

  ComparePassword(
    controlName: string,
    matchingControlName: string
  ) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  CheckSpace(fullNameControl: FormControl) {
    if (fullNameControl.value != null) {

      if (fullNameControl.errors && !fullNameControl.errors.spaces) {
        return;
      }
      if (fullNameControl.value != null && fullNameControl.value.includes(' ')) {
        fullNameControl.setErrors({ spaces: true });
      } else {
        fullNameControl.setErrors(null);
      }
    }

  }


  signInWithGoogle(): void {
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      this.loading = true;
      const form = new FormData();
      form.append('token', data.token);
      form.append('server', 'google');
      this._userService.signUpGoogle({ token: data.token, server: 'google' }).pipe(finalize(() => this.loading = false)).subscribe((response: any) => {
        this.saveUser(response.data);
        this._router.navigate(['/']);
      });
    });
  }

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

}
