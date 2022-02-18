import { Component, Input, OnInit } from '@angular/core';

import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.scss']
})
export class FieldErrorDisplayComponent implements OnInit {

  displayError: boolean;
  @Input() errorMsg: string;
  @Input() field: string;



  constructor(private _validationService: ValidationService) { }

  ngOnInit(): void {

    this._validationService.formSubject.subscribe((object) => {
      this.errorMsg = this._validationService.isFieldValid(object['form'], this.field, object['submit']);
    });
  }


}
