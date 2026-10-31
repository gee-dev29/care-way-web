import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { DesktopButton } from '../desktop-button/desktop-button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-upload-card',
  imports: [CommonModule, DesktopButton],
  templateUrl: './upload-card.html',
  styleUrl: './upload-card.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UploadCard {
  @Output() viewUpload = new EventEmitter<Event>();
  @Output() deleteUpload = new EventEmitter<Event>();
  @Input() uploads$: Observable<any>;
  @Input() showDelete: boolean;
  @Input() primaryView = true;

  view(url: string) {
    window.open(url, '_blank');
  }

  delete(item: any) {
    this.deleteUpload.emit(item);
  }
}
