import { ProfileService } from './../../profile.service';
import { Component, OnInit, Input } from '@angular/core';
import { ValidationService } from 'src/app/services/validation.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit {
  @Input() modalRef: NgbModalRef;
  passwordForm: FormGroup;
  formSubmit: boolean;
  loading: boolean;
  constructor(
    private _validationService: ValidationService,
    private _formBuilder: FormBuilder,
    private _profileService:ProfileService,

  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.InitialForm();
  }
  InitialForm() {
    this.passwordForm = this._formBuilder.group({
      old_password: [null, Validators.required],
      new_password: [null, Validators.required],
      confirm_new_password: [null, Validators.required],
    });
    this._validationService.formSubject.next({
      form: this.passwordForm,
      submit: this.formSubmit,
    });
  }
  close() {
    this.modalRef.close();
  }
  onSubmit(formData) {
    console.log(formData);
    this.loading = true;
    this._profileService.changePassword(formData).subscribe((response) => {
      console.log(response);
      this.loading = false;
      this.close();
    },
    (err) => {
      console.log(err);
      this.loading = false;
    })
  }
}
