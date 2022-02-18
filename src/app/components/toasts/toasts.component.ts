import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  host: { '[class.ngb-toasts]': 'true' },
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent implements OnInit {

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
  }
  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
