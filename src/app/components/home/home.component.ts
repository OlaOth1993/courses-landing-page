import { ToastService } from './../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HomeService } from './home.service';
import { Component, OnInit, TemplateRef } from '@angular/core';

import { ICourse } from './../../entities/API-entities/course';
import { ICategory } from './../../entities/API-entities/category';
import { IContact } from 'src/app/entities/API-entities/contact';
import { IUser } from 'src/app/entities/API-entities/user';
import { StorageService } from 'src/app/services/storage.service';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: ICategory[];
  courses: ICourse[];
  isCategoriesLoaded: boolean;
  isCoursesLoaded: boolean;
  formSubscripe: Subscription;
  contact: IContact;
  contactForm: FormGroup;
  formSubmit: boolean;
  animation: string;
  loading: boolean;
  template: TemplateRef<any>;
  scroll = (event): void => {
    this.addEventListenerNav();
  };

  constructor(
    private _homeService: HomeService,
    private _validationService: ValidationService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _storageService: StorageService,
    public toastService: ToastService
  ) {
    this.isCategoriesLoaded = false;
    this.isCoursesLoaded = false;
    this.formSubmit = false;
    this.animation = 'pluse';
    this.loading = false;

    this.InitialForm();
    // this.SubscripeForm();
  }

  ngOnInit(): void {
    this.getPageData();
    window.addEventListener('scroll', this.scroll, true);

  }
  addEventListenerNav() {
    let options = {
      root: null,
      rootMargin: '10px',
      threshold: 1.0
    }
    const observer = new IntersectionObserver((entries, options) => {

      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        let parent = document.querySelector(
          `li a[href="#${id}"]`
        )?.parentElement;

        if (parent == null) return null;
        if (entry.intersectionRatio > 0) {
          document
            .querySelector(`li a[href="#${id}"]`)
            .parentElement.classList.add('active');
        } else {
          document
            .querySelector(`li a[href="#${id}"]`)
            .parentElement.classList.remove('active');
        }
      });
    });

    // Track all sections that have an `id` applied
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

  }
  showSuccess() {
    this.toastService.show(this.template,
      {
        classname: 'custom',
        delay: 10000,
        autohide: true,
        icon: 'assets/icons/chat-group-icon.svg',
        title: "Sent Successfully!",
        description: "You've just sent a message",
      });
  }
  getPageData() {
    this.getPopularCourses();
    this.getCategories();
  }

  getCategories() {
    this._homeService.getCategories().subscribe(
      (response: any) => {
        this.categories = response.data;
        this.isCategoriesLoaded = true;
        console.warn(this.categories);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getPopularCourses() {
    this._homeService.getCourses().subscribe(
      (response: any) => {
        this.courses = response.data;
        this.isCoursesLoaded = true;
        console.warn(this.courses);
      },
      //! component scope error handling
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }
  goToCategories() {
    this._router.navigateByUrl('/category');

  }
  goToCourses() {
    this._router.navigateByUrl('/courses');
  }
  goToCoursDetail(id) {
    // this._router.navigateByUrl('/courses/course-detail');
    this._router.navigate(['/courses/course-detail', id])
  }
  InitialForm() {
    this.contactForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      description: [null, Validators.required],
    });
    // this._validationService.formSubject.next({
    //   form: this.contactForm,
    //   submit: this.formSubmit,
    // });
  }
  SubscripeForm() {
    this.formSubscripe = this.contactForm.valueChanges.subscribe(() => {
      this._validationService.formSubject.next({
        form: this.contactForm,
        submit: this.formSubmit,
      });
    });
  }
  onSubmit(formData: any, formDirective: FormGroupDirective) {
    this.formSubmit = true;
    if (this.contactForm.valid) {
      this.loading = true;
      this.contact = formData;
      this._homeService.contactUs(this.contact).subscribe(
        (response: any) => {
          console.log('response', response);
          this.loading = false;
          formDirective.resetForm();
          this.contactForm.reset();
          this.showSuccess();
        },
        (error) => {
          console.log('error', error);
          this.loading = false;
        },

      );
    } else {
      this._validationService.validateAllFormFields(this.contactForm);
      this._validationService.formSubject.next({
        form: this.contactForm,
        submit: this.formSubmit,
      });
    }
    console.log();
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scroll, true);
  }
}
