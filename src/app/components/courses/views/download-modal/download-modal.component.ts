import { IResource } from './../../../../entities/abstract-entities/resource';
import { Component, OnInit, Input} from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
  styleUrls: ['./download-modal.component.scss']
})
export class DownloadModalComponent implements OnInit {
  @Input() modalRef: NgbModalRef;
  @Input() resourcesCheckedList: IResource[];
  @Input() extension: string;
  resourcesCheckedlength: number;
  constructor() {
    this.resourcesCheckedlength = -1;
  }

  ngOnInit(): void {
    this.getExtension();
    if (this.resourcesCheckedList){
    this.getResourcesLength();
  }
  }
  getResourcesLength(): void{
    this.resourcesCheckedlength = this.resourcesCheckedList.length;
  }


  getExtension(): void{
    if (length === 1){
      this.extension = this.resourcesCheckedList[0].extension;
    }
  }

}
