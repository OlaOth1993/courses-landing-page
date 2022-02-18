import { StorageService } from './../../../../services/storage.service';
import { Router } from '@angular/router';
import { ISub_category } from './../../../../entities/abstract-entities/sub-category';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/entities/API-entities/category';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categories: ICategory[];
  subCategories: ISub_category[];
  categoryId: number;
  title: string;
  categoriesLoaded: boolean;

  constructor(
    private categoryService: CategoryService,
    private route: Router,
    private storage: StorageService
  ) {
    this.title = 'ALL CATEGORIES';
  }

  ngOnInit(): void {
    this.requestData();
  }

  requestData(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response: any) => {
        console.log(response);
        this.categories = response.data;
        this.categoriesLoaded = true;
        console.log(this.categories);
      },
      //! component scope error handling
      (error: HttpErrorResponse) => {
        console.error(error.status);
      }
    );
  }

  goToSubCategory(category: ICategory): void {
    this.route.navigateByUrl('category/sub-category');
    this.storage.setLocalObject('category', category);
  }

  checkPageLoaded(): boolean {
    return this.categoriesLoaded;
  }
}
