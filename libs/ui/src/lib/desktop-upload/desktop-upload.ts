import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { v4 } from 'uuid';

@Component({
  selector: 'ui-desktop-upload',
  imports: [],
  templateUrl: './desktop-upload.html',
  styleUrl: './desktop-upload.css',
})
export class DesktopUpload implements OnDestroy {
  @Input() isOpen = false;
  @Input() title = 'Upload Logo';

  @Output() closed = new EventEmitter<any>();
  @Output() upload = new EventEmitter<{
    id: string;
    name: string;
    url: string;
  }>();

  fileName = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  errorMessage = '';

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const MAX_FILE_SIZE_BYTES = 200 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
    input.value = '';

    if (!file) return;

    this.errorMessage = '';

    if (!ALLOWED_TYPES.includes(file.type)) {
      this.errorMessage = 'Only JPG, JPEG, or PNG files are allowed.';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      this.errorMessage = 'File size must not exceed 200kb.';
      return;
    }

    this.setFile(file);
  }

  onUpload() {
  if (!this.selectedFile) return;

  const reader = new FileReader();

  reader.onload = () => {
    this.upload.emit({
      id: v4(),
      name: this.selectedFile!.name,
      url: reader.result as string,
    });

    this.close();
  };

  reader.readAsDataURL(this.selectedFile);
}

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close() {
    this.reset();
    this.closed.emit();
  }

  setFile(file: File) {
    this.clearPreview();
    this.selectedFile = file;
    this.fileName = file.name;
    this.previewUrl = URL.createObjectURL(file);
  }

  clearPreview() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

  reset() {
    this.clearPreview();
    this.fileName = '';
    this.selectedFile = null;
    this.errorMessage = '';
  }

  ngOnDestroy() {
    this.clearPreview();
  }
}
