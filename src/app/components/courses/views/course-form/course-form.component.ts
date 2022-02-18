import { Component, OnInit } from '@angular/core';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ICategory } from 'src/app/entities/API-entities/category';
import { ISub_category } from 'src/app/entities/abstract-entities/sub-category';
import { ILanguage } from 'src/app/entities/API-entities/language';
import { finalize } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { ValidationService } from 'src/app/services/validation.service';
import { ISchedule } from 'src/app/entities/abstract-entities/Schedule';
import { IPrev_skill } from 'src/app/entities/abstract-entities/prev-skill';
import { ICourse } from 'src/app/entities/API-entities/course';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../../courses.service';
import { CategoryService } from 'src/app/components/category-module/category.service';
import { ProfileService } from 'src/app/components/profile/profile.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  maxMonths: number = 6;
  bsInlineRangeValue: Date[];
  bsInlineValue = new Date();
  maxDate: Date = new Date();
  maxYear: Date = new Date();

  effortCounter = 0;
  studentsCounter = 0;
  sessionDurationCounter = 0;
  courseDurationCounter = 1;

  categoriesList: ICategory[] = [];
  subCategoriesList: ICategory[] = [];
  levelCourseList: string[] = ['beginner', 'medium', 'expert'];
  languagesList: ILanguage[] = [];
  weekDaysList: string[] = [];
  sessionsCalenderList = [{ time: '00:00', amPM: 'PM', day: '' }];
  schedule: ISchedule[] = [];
  skillList: IPrev_skill[] = [{ skill: '' }];

  categories: ICategory[];
  subCategories: ISub_category[];
  languages: ILanguage[];

  loading: boolean = false;
  isLoadingSubCategory: boolean = false;
  isCourseLoaded: boolean = false;

  startCourseDate: Date = new Date();
  endCourseDate: Date = new Date();

  courseForm: FormGroup;
  videoForm: FormGroup;
  formSubscripe: Subscription;
  formSubmit: boolean = false;

  course: ICourse;

  msgSessions: string = '';
  msgDate: string = '';
  VideoFile: any = null;

  categoryName: string = '';

  selectImg: boolean = false;
  selectVideo: boolean = false;

  urlImg: string = '';
  urlVideo: string = '';

  modalRef: NgbModalRef;

  isUpdated: boolean = false;

  oldCourse: ICourse;

  courseId: number;

  isDisabledDate: boolean = true;

  maxVideoFile = 10;
  maxImgFile = 5;

  constructor(
    private _localService: BsLocaleService,
    private _courseService: CoursesService,
    private _categoryService: CategoryService,
    private _profileService: ProfileService,
    private _formBuilder: FormBuilder,
    private _validationService: ValidationService,
    private _location: Location,
    private _router: Router,
    private _helperFuncService: HelperFunctionsService,
    private _toastService: ToastService,
    private _modalService: NgbModal,
    private _activeRoute: ActivatedRoute
  ) {
    this.InitialForm();
    this.RouteParams();
    this.FetchData();
    this.valueDatePicker([
      new Date(),
      new Date().setDate(new Date().getDate() + 1),
    ]);
  }

  ngOnInit(): void {
    this.InitialForm();
    this.FetchData();
    this.RouteParams();
    this.weekDaysList = this._helperFuncService.getDays(
      this.startCourseDate,
      this.endCourseDate
    );
  }

  RouteParams() {
    this._activeRoute.params.subscribe((params: Params) => {
      this.courseId = params['courseId'];
      this.isUpdated = this.courseId != undefined;
      if (this.courseId != undefined) this.FetchCourse();
      else this.InitiDatePicker();
    });
  }

  UpdateCourse() {
    this.GetSubCategories(this.oldCourse.parent_category_id);

    this.selectImg = true;
    this.selectVideo = this.oldCourse.url_video != null;
    this.urlImg = this.oldCourse.img;
    this.urlVideo = this.oldCourse.url_video;

    this.courseForm.patchValue({
      name: this.oldCourse.name,
      description: this.oldCourse.description,
      price: this.oldCourse.price,
      baseCategory: this.oldCourse.parent_category_id,
      target: this.oldCourse.target,
      category_id: this.oldCourse.category_id,
      level: this.oldCourse.level,
      language_id: this.oldCourse.language.id,
      img: this.oldCourse.img,
      imageFile: '',
    });

    this.sessionDurationCounter = this.oldCourse.duration;
    this.effortCounter = this.oldCourse.effort;
    this.studentsCounter = this.oldCourse.student_number;
    this.courseDurationCounter = this.oldCourse.number_hour;

    this.skillList = this.oldCourse.prev_skill;

    this.bsInlineRangeValue = [
      new Date(this.oldCourse.start_time),
      new Date(this.oldCourse.end_time),
    ];

    this.sessionsCalenderList = [];
    if (this.oldCourse.schedule == null) {
      this.sessionsCalenderList.push({ time: '00:00', amPM: 'PM', day: '' });
    } else {
      this.oldCourse.schedule.forEach((element: ISchedule) => {
        let timeMofifier = this._helperFuncService
          .convert24to12(element.time)
          .split(' ');
        this.sessionsCalenderList.push({
          time: timeMofifier[0],
          amPM: timeMofifier[1],
          day: element.weekday,
        });
      });
    }

    this.isCourseLoaded = true;
  }

  InitialForm() {
    this.courseForm = this._formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(30)]],
      description: [null, Validators.required],
      price: [null, Validators.required],
      target: [null, Validators.nullValidator],
      baseCategory: [null, Validators.required],
      category_id: [null, Validators.required],
      level: [null, Validators.required],
      language_id: [null, Validators.required],
      effort: [this.effortCounter, Validators.required],
      student_number: [this.studentsCounter, Validators.required],
      number_hour: [this.courseDurationCounter, Validators.required],
      duration: [this.sessionDurationCounter, Validators.required],
      imageFile: [
        null,
        this.isUpdated ? Validators.nullValidator : Validators.required,
      ],
      Video: [null, Validators.nullValidator],
      start_time: [null, Validators.nullValidator],
      end_time: [null, Validators.nullValidator],
      img: [null, Validators.nullValidator],
      ImgFile: [null, Validators.nullValidator],
      schedule: [null, Validators.required],
      prev_skill: [null, Validators.nullValidator],
    });

    this._validationService.formSubject.next({
      form: this.courseForm,
      submit: this.formSubmit,
    });

    this.formSubscripe = this.courseForm.valueChanges.subscribe(() => {
      this._validationService.formSubject.next({
        form: this.courseForm,
        submit: this.formSubmit,
      });
    });
  }

  InitiDatePicker() {
    this.bsInlineValue.setDate(
      this.isUpdated
        ? new Date(this.oldCourse.start_time).getDate()
        : new Date().getDate()
    );
    this.maxDate.setDate(
      this.isUpdated
        ? new Date(this.oldCourse.end_time).getDate()
        : this.maxDate.getDate() + 1
    );
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
    enGbLocale.weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    enGbLocale.week.dow = 0;
    this.maxYear.setDate(new Date().getFullYear() + 1);
    defineLocale('en-uk', enGbLocale);
    this._localService.use('en-uk');
  }

  FetchData() {
    this.getCategories();
    this.getLanguages();
  }

  onSubmit(formData) {
    this.courseForm.patchValue({
      duration: this.sessionDurationCounter,
      effort: this.effortCounter,
      student_number: this.studentsCounter,
      number_hour: this.courseDurationCounter,
    });

    this.formSubmit = true;
    this.pipeSubmit();
    console.log(this.courseForm.value);
    console.warn('Valid : ' + this.courseForm.valid);
    console.warn('StartEnd : ' + this.validateStartEnd());
    console.warn('Sessions : ' + this.validateSessions());
    if (
      this.courseForm.valid &&
      this.validateStartEnd() &&
      this.validateSessions()
    ) {
      this.uploadFile([this.courseForm.get('ImgFile').value]);
    } else {
      this._validationService.validateAllFormFields(this.courseForm);
      this._validationService.formSubject.next({
        form: this.courseForm,
        submit: this.formSubmit,
      });
    }
  }

  valueDatePicker(rangeDate) {
    this.msgDate = '';
    this.startCourseDate = new Date(rangeDate[0]);
    this.endCourseDate = new Date(rangeDate[1]);
    if (
      this._helperFuncService.monthDiff(
        this.startCourseDate,
        this.endCourseDate
      ) > this.maxMonths
    )
      this.msgDate = 'course duration must be at most 6 months';
    else if (
      this._helperFuncService.compareDates(
        this.endCourseDate,
        this.startCourseDate
      ) != 1
    )
      this.msgDate = 'start date must be before end date';
    else if (
      this._helperFuncService.compareDates(this.startCourseDate, new Date()) ==
      -1 &&
      !this.isUpdated
    )
      this.msgDate = 'start date must be scheduled at least from today';
    else if (
      this._helperFuncService.compareDates(
        this.startCourseDate,
        this.maxYear
      ) == 1
    )
      this.msgDate = 'you must schedule at this year or next year only ';
    else {
      this.courseForm.patchValue({
        start_time: this._helperFuncService.formatDate(this.startCourseDate),
      });
      this.courseForm.patchValue({
        end_time: this._helperFuncService.formatDate(this.endCourseDate),
      });
      this.weekDaysList = this._helperFuncService.getDays(
        this.startCourseDate,
        this.endCourseDate
      );
    }
  }

  validateStartEnd(): boolean {
    this.startCourseDate = new Date(this.courseForm.get('start_time').value);
    this.endCourseDate = new Date(this.courseForm.get('end_time').value);

    if (
      this._helperFuncService.monthDiff(
        this.startCourseDate,
        this.endCourseDate
      ) > this.maxMonths ||
      this._helperFuncService.compareDates(
        this.endCourseDate,
        this.startCourseDate
      ) != 1 ||
      (this._helperFuncService.compareDates(this.startCourseDate, new Date()) ==
        -1 &&
        !this.isUpdated) ||
      this._helperFuncService.compareDates(
        this.startCourseDate,
        this.maxYear
      ) == 1
    )
      return false;
    return true;
  }

  validateSessions(): boolean {
    var set = new Set();
    var timesSessions: [{ time: [string] }] = [{ time: [''] }];
    this.msgSessions = '';
    var idx = 0;
    if (
      this.sessionsCalenderList.length * this.sessionDurationCounter >
      this.courseDurationCounter * 60
    ) {
      this.msgSessions =
        'Number of sessions should be relative with course duration';
      return false;
    }
    this.sessionsCalenderList.forEach((element) => set.add(element.day));
    set.forEach((dayValue: string) => {
      idx++;
      timesSessions.push({ time: [''] });
      this.sessionsCalenderList.forEach((element) => {
        if (dayValue == element.day)
          timesSessions[idx].time.push(
            this._helperFuncService.convert12to24Hour(
              element.time + ' ' + element.amPM
            )
          );
      });
      timesSessions[idx].time.splice(0, 1);
      if (timesSessions[idx].time.length == 1)
        timesSessions[idx].time.splice(0, 1);
    });
    timesSessions.splice(0, 1);
    if (this.minutesDiff(timesSessions)) {
      this.msgSessions = 'sessions are overlapping schedule';
      return false;
    }
    return true;
  }

  uploadFile(files) {
    this.loading = true;
    const file = new FormData();
    file.append('file', files[0]);
    if (files[0] != null && this._helperFuncService.isImg(files[0].name)) this.uploadImage(file);
    else this.editCourse(this.courseForm.value);
  }

  uploadImage(file) {
    this._profileService.uploadFile(file).subscribe((response: any) => {
      this.courseForm.patchValue({ img: response.data.url });
      this.course = this.courseForm.value;
      if (this.isUpdated) this.editCourse(this.courseForm.value);
      else
        this.createCourse();
    });
  }

  storeImage(files) {
    if (files[0].size / (Math.pow(1024, 2)) > this.maxImgFile) {
      this.courseForm.get('ImgFile').setErrors({ fileSizeImg: true });
      this.selectImg = false;
      this.urlImg = '';

    }
    else {

      this.courseForm.patchValue({ ImgFile: files[0] });

      this.courseForm.get('ImgFile').setErrors(null);

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlImg = event.target.result;
      };
      reader.readAsDataURL(files[0]);
      this.selectImg = true;
    }

  }


  uploadVideo(video) {
    this.showUploadingVideo();
    this._profileService.uploadVideo(video).subscribe(() => {
      this._toastService.toasts = [];
      this.showFinishedUploadVideo();
    }
    );
  }

  storeVideo(files) {

    if (files[0].size / (Math.pow(1024, 2)) > this.maxVideoFile) {

      this.courseForm.get('Video').setErrors({ fileSizeVideo: true });
      if (this.modalRef != null) this.modalRef.close();
      this.urlVideo = '';
      this.selectVideo = false;

    }
    else {
      this.VideoFile = files[0];
      this.courseForm.get('Video').setErrors(null);

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlVideo = event.target.result;
      };

      reader.readAsDataURL(files[0]);
      this.selectVideo = true;

    }

    if (this.courseForm.get('url_video') != null)
      this.courseForm.removeControl('url_video');

  }

  createCourse() {
    this._courseService
      .createCourse(this.course)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response: any) => {
        this.ShowMessageSuccess(response.data.name);
        this._router.navigate(['/GivenCourses']);

        if (this.VideoFile != null) {
          const video = new FormData();
          video.append('file', this.VideoFile);
          video.append('course_id', response.data.id);
          this.uploadVideo(video);
        }
      });
  }

  editCourse(form) {
    this._courseService
      .editCourse(this.courseId, form)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((response: any) => {
        this.showSuccessUpdate();
        if (this.VideoFile != null) {
          const video = new FormData();
          video.append('file', this.VideoFile);
          video.append('course_id', this.courseId.toString());
          this.uploadVideo(video);
        }
      });
  }

  pipeSubmit() {
    console.log(this.sessionsCalenderList);
    this.schedule = [];
    this.sessionsCalenderList.forEach((element) => {
      this.schedule.push({
        weekday: element.day,
        time: this._helperFuncService.convert12to24Hour(
          element.time + ' ' + element.amPM
        ),
      });
    });
    console.log(this.schedule);
    this.courseForm.patchValue({
      schedule: JSON.stringify(this.schedule),
      prev_skill: JSON.stringify(this.skillList),
    });
  }

  c24to12(time) {
    if (time.value !== '') {
      console.log('Old!');
      console.log(time);
      var hours = time.split(':')[0];
      var minutes = time.split(':')[1];
      hours = hours % 12 || 12;
      hours = hours < 10 ? '0' + hours : hours;

      console.log('New!');
      console.log(hours + ':' + minutes);
      return hours + ':' + minutes;
    }
  }

  processWeekDay(day, idx) {
    var newDay =
      this.weekDaysList.indexOf(day) > -1 ? day : this.weekDaysList[0];
    this.sessionsCalenderList[idx].day = newDay;
    return newDay;
  }

  ShowDialog(content) {
    this.modalRef = this._modalService.open(content, { centered: true });
  }

  CancelVideo() {
    this.VideoFile = null;
    this.selectVideo = false;
    this.urlVideo = '';
    this.courseForm.addControl('url_video', new FormControl(''));
  }

  Cancel(content) {
    this.modalRef = this._modalService.open(content, { centered: true });
  }

  minutesDiff(times: [{ time: [string] }]): boolean {
    for (let idx = 0; idx < times.length; idx++) {
      var time = times[idx].time;
      for (let idx1 = 0; idx1 < time.length; idx1++) {
        var element1 = time[idx1];
        for (let idx2 = 0; idx2 < time.length; idx2++) {
          var element2 = time[idx2];
          if (
            this._helperFuncService.diffTime(element1, element2) <
            this.sessionDurationCounter
          )
            return true;
        }
      }
    }
    return false;
  }

  //#region Messages
  ShowMessageSuccess(courseName: string) {
    this._toastService.show(undefined, {
      icon: 'assets/icons/my-courses-icon.svg',
      title: '"' + courseName + '"' + ' was added',
      description:
        "You've just Added a new course at " +
        '"' +
        this.categoryName +
        '"' +
        ' category',
    });
  }

  showSuccessUpdate() {
    this._toastService.show(undefined, {
      icon: 'assets/icons/my-courses-icon.svg',
      title: 'Updated Successfully!',
      description: "You've just update your course information",
    });
  }

  showUploadingVideo() {
    this._toastService.show(undefined, {
      icon: 'assets/icons/loading-gif-transparent-2.gif',
      title: 'Your Video is Uploading!',
      description: "please be patient",
    }, false);
  }

  showFinishedUploadVideo() {
    this._toastService.show(undefined, {
      icon: 'assets/icons/correct.png',
      title: 'Your Video is Uploaded!',
    });
  }
  //#endregion

  //#region Dialog

  close() {
    this.modalRef.close();
  }

  ok() {
    this._location.back();
  }
  //#endregion

  //#region  Requests

  getCategories() {
    this.isCourseLoaded = false;
    this._categoryService
      .getCategories()
      .pipe(finalize(() => (this.isCourseLoaded = true)))
      .subscribe((response: any) => {
        this.categories = response.data;
        this.categoriesList = [];
        this.categories.forEach((element: ICategory) => {
          this.categoriesList.push(element);
        });
      });
  }

  GetSubCategories(categoryId) {
    this.isLoadingSubCategory = true;
    this._categoryService
      .getSubCategories(categoryId)
      .pipe(finalize(() => (this.isLoadingSubCategory = false)))
      .subscribe((response: any) => {
        this.subCategories = response.data;
        this.subCategoriesList = [];
        this.subCategories.forEach((element: ISub_category) => {
          this.subCategoriesList.push(element);
        });
      });
  }

  getLanguages() {
    this.isCourseLoaded = false;
    this._courseService
      .getLanguages()
      .pipe(finalize(() => (this.isCourseLoaded = true)))
      .subscribe((response: any) => {
        this.languages = response.data;
        this.languagesList = [];
        this.languages.forEach((element: ILanguage) => {
          this.languagesList.push(element);
        });
      });
  }

  FetchCourse() {
    this.isCourseLoaded = false;
    this._courseService.getCourse(this.courseId).subscribe((response: any) => {
      this.oldCourse = response.data;
      console.log(this.oldCourse);
      this.bsInlineRangeValue = [
        new Date(this.oldCourse.start_time),
        new Date(this.oldCourse.end_time),
      ];
      this.FetchParentCategory(this.oldCourse.category_id);
      this.InitiDatePicker();
    });
  }

  FetchParentCategory(subCategoryId) {
    this._courseService
      .getParentCategory({ category_id: subCategoryId })
      .subscribe((response: any) => {
        this.oldCourse.parent_category_id = response.data.category_id;
        this.UpdateCourse();
      });
  }

  //#endregion
}
