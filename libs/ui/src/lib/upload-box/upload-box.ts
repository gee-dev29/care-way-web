import {
  CommonModule
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'ui-upload-box',
  imports: [CommonModule],
  templateUrl: './upload-box.html',
  styleUrl: './upload-box.css',
})
export class UploadBox implements OnChanges {
  @Input() label: string;

  @Input() imageUrl: any | null = null;
  @Input() imageName: any | null = null;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileDeleted = new EventEmitter<void>();

  fileName = '';
  previewUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imageUrl'] || changes['imageName']) {
      this.previewUrl = this.imageUrl;
      this.fileName = this.imageName ?? '';
    }
  }

  ngOnDestroy() {
    this.clearPreview();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.fileName = file.name;
      this.setPreview(file);
      this.fileSelected.emit(file);
    }
  }

  deleteFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.clearPreview();
    this.fileName = '';
    this.fileDeleted.emit();
  }

  setPreview(file: File) {
    this.clearPreview();
    this.previewUrl = URL.createObjectURL(file);
  }

  clearPreview() {
    if (this.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
  }
}