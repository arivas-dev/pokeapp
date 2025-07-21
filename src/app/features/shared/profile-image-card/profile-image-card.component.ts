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
  @Input() showName: boolean = false;
  @Input() profileInfo: ProfileInfo = {};
  @Input() isEditMode: boolean = true;
  @Input() showDashboardHeader: boolean = false;
  
  @Output() fileSelected = new EventEmitter<Event>();
  @Output() fileRemoved = new EventEmitter<void>();

  get documentLabel(): string {
    // Si no hay edad, default a DUI
    if (!this.profileInfo.age) return 'Carnet de minoridad';

    return this.isAdult() ? 'DUI' : 'Carnet de minoridad';
  }

  isAdult(): boolean {
    if (!this.profileInfo.age) return false;
    const match = /([0-9]+)/.exec(this.profileInfo.age);
    const age = match ? parseInt(match[1], 10) : 0;
    return age >= 18;
  }

  onFileSelected(event: Event): void {
    this.fileSelected.emit(event);
  }

  onFileRemoved(): void {
    this.fileRemoved.emit();
  }
}
