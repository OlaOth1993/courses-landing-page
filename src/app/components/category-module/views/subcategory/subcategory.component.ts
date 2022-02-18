import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MdbTabComponent } from 'mdb-angular-ui-kit/tabs';
import { MdbTabChange, MdbTabsComponent } from 'mdb-angular-ui-kit/tabs/tabs.component';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ISub_category } from 'src/app/entities/abstract-entities/sub-category';
import { ICategory } from 'src/app/entities/API-entities/category';
import { ICourse } from 'src/app/entities/API-entities/course';
import { StorageService } from 'src/app/services/storage.service';
import { CategoryService } from '../../category.service';
import {NgbCarousel, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {
  subCategories: ISub_category[];
  categories: ICategory[];
  categoryStorage: ICategory;
  subCategoryCourses: ICourse[];
  categoryId: number;
  categoryName: string;
  categoryRoute: string;
  title: string;
  categoryIndex: any;
  subCategoryIndex: number;
  count: number;
  numbers: Array<number>;
  categoriesLoaded: boolean;
  subCategoriesLoaded: boolean;
  public activeTab: string; 
  tabIndex: number;
  indexx: number;
  el: HTMLElement
  selectedIndex: number;
  active: number;
  items: Array<any> = []//  @ViewChild('tabs' ,{static: true }) tabs: MdbTabsComponent;
  @ViewChild('tab') tab: MdbTabComponent;
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;
 // @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
 // @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  constructor(
    private categoryService: CategoryService,
    private route: Router,
    private datepipe: DatePipe,
    private storage: StorageService,
    public mediaObserver: MediaObserver
  ) {
    this.title = 'ALL CATEGORIES >';

  }
  prevSlide() {
    this.carousel.prev();
  }

  nextSlide() {
    this.carousel.next();
  }

  stopSlider() {
    this.carousel.pause();
  }

  ngOnInit(): void {
    this.getCategoryStorageID();
    this.requestData(this.categoryId);

    //this.active = this.categoryId;

  }
/*   selectTab(tabId: number) {
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
      this.tabIndex = tabId;
    }
  } */

  setActive(catID_Stor: number){
    let i = 0;
   this.categories.forEach((category:ICategory) =>
   { if(category.id == catID_Stor){
      this.active = i;}
      i++;
   });
  // this.getSubCategories(this.active);
  }
  requestData(id: number): void {
    this.getCategories();
    this.getSubCategories(id);
    

  }
  changeActiveTab() {
  // item.

   // this.tabset.setActiveTab(3);
  }
  ngAfterViewInit(): void {
   // this.tabset.setActiveTab(this.categoryIndex);
   
  }
  test(){
    console.log("testttttt")
  }

  getCategoryStorageID(): void {
    this.categoryStorage = this.storage.getLocalObject('category');
    this.categoryId = this.categoryStorage.id;
    //this.categoryIndex = this.categoryId;
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        console.log(response);
        this.categories = response.data;
        this.categoriesLoaded = true;

        console.log('categories', this.categories);
        this.setActive(this.categoryId);
        console.log("active",this.active)

      },
      //  ! component scope error handling
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }

  getSubCategories(categoryID: number): void {
    this.subCategories = [];
    this.categoryService.getSubCategories(categoryID).subscribe(
      (response: any) => {
        this.subCategories = response.data;
        this.subCategoriesLoaded = true;
        console.log('subCategories', this.subCategories);
        this.getDateFormat(this.subCategories);
        this.getRouteByID(categoryID);
        this.getCategoryIndex(categoryID);
        this.getLoopCounter();
        this.numbers = this.numSequence(this.count);
        console.log('this.numbers', this.numbers);
        console.log("indexx",this.categoryIndex)

      },
      //  ! component scope error handling
      (error: HttpErrorResponse) => {
        console.error("error",error.status);
        if(error.status== 410)
        this.subCategories = [];
      }
    );
  }
/*   onTabSelect(data: NgxTabChangeEvent) {
    if (data.hasOwnProperty('nextId')) { 
                this._router.navigate(...);
            }   
    } */
    
/* changeTab(event: MdbTabChange) {
  console.log("eventtt::",event)
} */
/* getActiveTab() {
  const activeTab = this.tabset.tabs.filter(tab => tab.active);
  console.log(activeTab);
} */

/* onTabChange(tabChangeEvent: MdbTabChange){ // work
  console.log(this.tab)

  console.log("evvvvvvvvv",tabChangeEvent);
  this.getRoute(tabChangeEvent.index);
    this.getSubCategories(this.categories[tabChangeEvent.index].id);
  
} */
onNavChange(changeEvent: NgbNavChangeEvent) {
  this.getRoute(changeEvent.nextId);
 // this.subCategories = [];
  this.getSubCategories(this.categories[changeEvent.nextId].id);
 // this.categoryIndex = changeEvent.nextId;

  console.log("next",changeEvent)

}

  getRouteByID(id: number): void {
    for (const category in this.categories) {
      if (this.categories[category].id == id) {
      console.log("idddddd",id)
        this.categoryRoute = this.categories[category].name;
      }
    }
  }

  getRoute(index: number): void {
    this.categoryRoute = this.categories[index].name;
  }

  getCategoryIndex(categoryId: number): void {
    for (const category in this.categories) {
      if (this.categories[category].id == categoryId) {
        this.categoryIndex = category;
      }
    }
  }

  goToAllCourses(subCategory: ISub_category): void {
    this.route.navigateByUrl('/courses');
    console.log('subCategory', subCategory);
    delete subCategory.isShown;
    this.storage.setLocalObject('subCategory-courses', subCategory);
    // this.categoryService.sharedSubCategories.next(subCategory);
  }

  toggleShowCard(subCategory: ISub_category): void {
    for (const sub in this.subCategories) {
      if (
        this.subCategories[sub].isShown === true &&
        this.subCategories[sub].id !== subCategory.id
      ) {
        this.subCategories[sub].isShown = false;
      }
    }
    subCategory.isShown = !subCategory.isShown;
  }

  goToCategories(): void {
    this.route.navigateByUrl('/category');
  }

/*   getLoopCounter(): void {
    this.count = Math.ceil((this.subCategories.length - 5) / 4);
    console.log(this.count);
  } */
  getLoopCounter(): void {
    this.count = Math.ceil((this.subCategories.length - 5) / 4);
    if (this.count < 0){
      this.count = 0;
    }
    console.log(this.count);
  }

  checkCategoryLoaded(): boolean {
    return this.categoriesLoaded;
  }

  checkSubLoaded(): boolean {
    return this.subCategoriesLoaded;
  }

  ngOnDestroy(): void {
    this.storage.removeLocalObject('category');
  }

  //  function to return list of numbers from 0 to n-1
  numSequence(n: number): Array<number> {
    return Array.from(Array(n).keys());
  }

  getDateFormat(subCategories: ISub_category[]): void {
    subCategories.forEach((subCategory: ISub_category) => {
      subCategory.courses.forEach((course: ICourse) => {
        course.start_time = this.datepipe.transform(
          course.start_time,
          'MMMM-dd  '
        );
      });
    });
  }


}
