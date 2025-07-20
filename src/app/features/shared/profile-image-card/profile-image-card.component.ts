import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ProfileInfo {
  name?: string;
  hobby?: string;
  age?: string;
  document?: string;
}

@Component({
  selector: 'app-profile-image-card',
  templateUrl: './profile-image-card.component.html',
  styleUrls: ['./profile-image-card.component.sass']
})
export class ProfileImageCardComponent {
  @Input() image: string | null = null;
  @Input() fileName: string | null = null;
  @Input() showFile: boolean = false;
  @Input() showInfo: boolean = false;
  @Input() profileInfo: ProfileInfo = {};
  @Input() isEditMode: boolean = true;
  
  @Output() fileSelected = new EventEmitter<Event>();
  @Output() fileRemoved = new EventEmitter<void>();

  onFileSelected(event: Event): void {
    this.fileSelected.emit(event);
  }

  onFileRemoved(): void {
    this.fileRemoved.emit();
  }
}
