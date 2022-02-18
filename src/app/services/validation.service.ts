import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  formSubject = new Subject<{ form: FormGroup; submit: boolean }>();
  mapErrors = new Map([
    ['required', 'this field is required'],
    ['email', 'this field must be an email!'],
    ['mustMatch', "this confirm password doesn't match password"],
    ['maxlength', 'this field must be at most 30 characters'],
    ['InvalidEmail', 'the email field in invalid'],
    ['InvalidPassword', 'the password field is invalid'],
    ['emailExsit', 'this email is already exsit please choose another email'],
    ['spaces', 'this field must not contain spaces'],
    ['fileSizeVideo', 'this file must be at most 10 MB'],
    ['fileSizeImg', 'this file must be at most 5 MB'],
  ]);

  constructor() { }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  isFieldValid(form: FormGroup, field: string, isSubmit: boolean) {
    if (
      (!form.get(field).valid && form.get(field).touched) ||
      (form.get(field).untouched &&
        form.get(field).errors?.required &&
        isSubmit)
    )
      return this.mapErrors.get(Object.keys(form.get(field).errors)[0]);
    return '';
  }
}
