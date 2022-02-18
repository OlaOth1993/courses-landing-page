import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/entities/API-entities/user';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/components/login/user.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Subscription } from 'rxjs';
import { IUserModel } from 'src/app/entities/abstract-entities/user-model';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { finalize } from 'rxjs/operators';
import { AuthService, GoogleLoginProvider } from 'ng-social-login-module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [

    trigger('inputAnimate', [
      state('in', style({
        opacity: 1,
        transform: 'translate(0,0)'
      })),

      transition('void=>*', [style({
        opacity: 0,
        transform: 'translate(400px, -50px)'
      }), animate(500)])
    ]),

    trigger('fade', [
      state('in', style({
        opacity: 1,
      })),

      transition('void=>*', [style({
        opacity: 0,
      }), animate('1s ease-in-out')])
    ]),

    trigger('submit', [
      state('in', style({
        opacity: 1,
        transform: 'translate(0,0)'
      })),

      transition('void=>*', [style({
        opacity: 0,
        transform: 'translate(400px, 40px)'
      }), animate(500)])
    ]),

    trigger('social', [
      state('in', style({
        opacity: 1,
        transform: 'translate(0,0)'
      })),

      transition('void=>*', [style({
        opacity: 0,
        transform: 'translate(500px, 90px)'
      }), animate(500)])
    ]),

  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  formSubscripe: Subscription;
  userLogin: IUserModel;
  loginForm: FormGroup;
  user: IUser;

  formSubmit: boolean = false;

  state = "out"

  loading: boolean = false;

  hide: boolean = true;

  constructor(
    private _validationService: ValidationService,
    private _storageService: StorageService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.InitialForm();
    this.state = "in";
  }

  ngOnInit(): void {
    this.InitialForm();
    this.SubscripeForm();
  }

  InitialForm() {
    this.loginForm = this._formBuilder.group({
      'email': [null, [Validators.required, Validators.email]],
      'password': [null, Validators.required]
    });
    this._validationService.formSubject.next({ form: this.loginForm, submit: this.formSubmit });
  }

  SubscripeForm() {
    this.formSubscripe = this.loginForm.valueChanges.subscribe(() => {
      this._validationService.formSubject.next({ form: this.loginForm, submit: this.formSubmit });
    });
  }

  onSubmit(formData) {
    this.formSubmit = true;

    if (this.loginForm.valid) {
      this.loading = true;
      this.userLogin = formData;
      this._userService.login(this.userLogin).pipe(finalize(() => this.loading = false)).subscribe(
        (response: any) => {

          this.saveUser(response.data);
          this._router.navigate(['/']);

        }, error => {

          this.loginForm.get('email').setErrors({ InvalidEmail: true });
          this.loginForm.get('password').setErrors({ InvalidPassword: true });

          this._validationService.validateAllFormFields(this.loginForm);
          this._validationService.formSubject.next({ form: this.loginForm, submit: this.formSubmit });
        });

    } else {

      this._validationService.validateAllFormFields(this.loginForm);

      this._validationService.formSubject.next({ form: this.loginForm, submit: this.formSubmit });
    }
  }

  saveUser(user: IUser) {
    this.user = user;
    console.warn('User from response', this.user);
    this._storageService.setToken(this.user.token);
    this._userService.setLocalStorageUser(this.user);
  }

  signInWithGoogle(): void {
    this._authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      this.loading = true;
      this._userService.signUpGoogle({ token: data.token, server: 'google' }).pipe(finalize(() => this.loading = false)).subscribe((response: any) => {
        this.saveUser(response.data);
        this._router.navigate(['/']);
      });
    });
  }

  ngOnDestroy() {
    this.formSubscripe.unsubscribe();
  }
}
