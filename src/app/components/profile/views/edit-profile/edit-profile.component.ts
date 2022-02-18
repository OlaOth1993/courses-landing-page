import { UserService } from 'src/app/components/login/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from './../../../../services/toast.service';
import { DatePipe } from '@angular/common';
import { ProfileService } from './../../profile.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ValidationService } from 'src/app/services/validation.service';
import { Country } from '@angular-material-extensions/select-country';
import { IUser } from 'src/app/entities/API-entities/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  loading: boolean;
  imgLoading: boolean;
  profileForm: FormGroup;
  formSubmit: boolean;
  selected: string;
  user: IUser;
  countryFormGroup: FormGroup;
  modalRef: NgbModalRef;
  selectedCountry: Country = {
    name: null,
    alpha2Code: null,
    alpha3Code: null,
    numericCode: null,
    callingCode: null,
  };

  image: string;

  constructor(
    private _profileService: ProfileService,
    private _validationService: ValidationService,
    private _formBuilder: FormBuilder,
    private _datePipe: DatePipe,
    public toastService: ToastService,
    private _location: Location,
    private _modalService: NgbModal,
    private _storageService: StorageService,
    private _userService: UserService
  ) {
    this.loading = false;
    this.imgLoading = false;
    this.formSubmit = false;
    this.image = null;
    this.InitialForm();
  }

  ngOnInit(): void {
    this.InitialForm();
    this.user = this._storageService.getLocalObject('user');
    if (this.user) this.updateProfileForm();
  }
  InitialForm() {
    this.countryFormGroup = this._formBuilder.group({
      country: [],
    });

    this.profileForm = this._formBuilder.group({
      full_name: [null, Validators.required],
      phone: [null, Validators.required],
      local_phone: [null, Validators.required],
      birthday: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      gender: [null, Validators.required],
      profile_img: [null],
      alpha2Code: [null],
    });

    // this.profileForm.valueChanges.subscribe(() => {
    //   this._validationService.formSubject.next({
    //     form: this.profileForm,
    //     submit: this.formSubmit,
    //   });
    // });
  }
  getProfileInfo() {
    this._profileService.getUsernfo().subscribe((response: any) => {
      this.user = response.data;
      console.warn(this.user);
      this.updateProfileForm();
    });
  }
  updateProfileForm() {
    let local_phone = this.hundlePhoneNumber();

    this.profileForm.patchValue({
      full_name: this.user.full_name,
      email: this.user.email,
      birthday: this._datePipe.transform(this.user.birthday, 'yyyy-MM-dd'),
      gender: this.user.gender,
      local_phone: local_phone,
      profile_img: this.user.profile_img,
    });
    this.image = this.user.profile_img;
  }
  hundlePhoneNumber() {
    this.selectedCountry.alpha2Code = this.user.alpha2Code;
    this.countryFormGroup.setValue({ country: this.selectedCountry });
    this.profileForm.patchValue({ alpha2Code: this.user.alpha2Code });
    if (this.user.phone) {
      let phone = this.user.phone;
      return phone.split('-')[1];
    } else return null;
  }
  handleFileInput(files) {
    /* To display image in Base64 before uploading to server */
    // const reader = new FileReader();
    // reader.readAsDataURL(files[0]);
    // reader.onload = (_event) => {
    //     this.url = reader.result;
    // }

    this.uplaodImage(files[0]);
  }
  uplaodImage(image) {
    const form = new FormData();
    form.append('file', image);
    this.imgLoading = true;
    this._profileService.uploadFile(form).subscribe((response: any) => {
      this.imgLoading = false;
      this.image = response.data.url;
      this.profileForm.patchValue({ profile_img: response.data.url });
    });
  }
  onCountrySelected($event: Country) {
    console.warn($event);
    this.profileForm.patchValue({ alpha2Code: $event.alpha2Code });
  }
  showSuccessUpdate() {
    this.toastService.show(undefined, {
      icon: 'assets/icons/chat-group-icon.svg',
      title: 'Updated Successfully!',
      description: "You've just update your profile information",
    });
  }
  onSubmit(formData: any) {
    console.log(formData);
    console.log(this.selectedCountry.callingCode);
    this.profileForm.patchValue({
      phone:
        this.countryFormGroup
          .get('country')
          .value.callingCode.replace('+', '00') +
        '-' +
        this.profileForm.get('local_phone').value,
    });
    this.profileForm.get('local_phone').disable();
    console.warn(this.profileForm.value);
    if (this.profileForm.valid) {
      this.loading = true;
      this._profileService.updateProfile(this.profileForm.value).subscribe(
        (response) => {
          console.log(response);
          this.loading = false;
          this.showSuccessUpdate();
          this.profileForm.get('local_phone').enable();
          this.updateLocalStorage(this.profileForm.value);
        },
        (err) => {
          console.log(err);
          this.profileForm.get('local_phone').enable();
          if (err.status == 400) {
            this.toastService.show(undefined, {
              icon: 'assets/icons/chat-group-icon.svg',
              title: 'Error!',
              description: 'Missing Param',
            });
          } else if (err.status == 450) {
            this.toastService.show(undefined, {
              icon: 'assets/icons/chat-group-icon.svg',
              title: 'Error!',
              description: 'Invalid Phone',
            });
          } else if (err.status == 420) {
            this.toastService.show(undefined, {
              icon: 'assets/icons/chat-group-icon.svg',
              title: 'Error!',
              description: 'This Email is already exist',
            });
          }
          this.loading = false;
        }
      );
    }
  }
  updateLocalStorage(userForm: IUser) {
    // Create arrays of property names
    var editedUser = Object.getOwnPropertyNames(userForm);
    var storeduser = Object.getOwnPropertyNames(this.user);

    for (var i = 0; i < editedUser.length; i++) {
      var propName = editedUser[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (this.user[propName] !== userForm[propName]) {
        this.user[propName] = userForm[propName];
      }
    }
    this._userService.setLocalStorageUser(this.user);
  }
  cancel(content) {
    this.modalRef = this._modalService.open(content, { centered: true });
    //
  }
  close() {
    this.modalRef.close();
  }
  ok() {
    this._location.back();
    this.close();
  }
}
