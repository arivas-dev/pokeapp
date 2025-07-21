import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { TrainerStore, TrainerProfile as StoreTrainerProfile } from '../../../store/trainer';

interface TrainerProfile {
  name: string;
  hobbies?: string[];
  birthday: Date;
  document: string;
  profileImage?: string;
}

function createThumbnail(file: File, size = 100, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e: any) => {
      img.src = e.target.result;
    };
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx!.fillStyle = '#fff';
      ctx!.fillRect(0, 0, size, size);
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx!.drawImage(img, sx, sy, min, min, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.sass']
})
export class ProfileFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('hobbyInput', { static: false }) hobbyInput!: ElementRef;
  
  profileForm!: FormGroup;
  profileImage: string | null = null;
  selectedFileName: string | null = null;
  selectedHobbies: string[] = [];
  filteredHobbies: Observable<string[]> = new Observable<string[]>();
  
  private readonly destroy$ = new Subject<void>();

  // List of suggested hobbies
  private readonly hobbies: string[] = [
    'Jugar Fútbol',
    'Jugar Basquetball',
    'Jugar Tennis',
    'Jugar Voleibol',
    'Jugar Fifa',
    'Jugar Videojuegos'
  ];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly trainerStore: TrainerStore
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupHobbyAutocomplete();
  }

  ngAfterViewInit(): void {
    // Focus the input initially
    // this.focusInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the profile form with validations
   */
  private initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      hobby: [''], // Input for search
      birthday: ['', [Validators.required, this.ageValidator.bind(this)]],
      document: ['', [Validators.required, this.documentValidator.bind(this)]]
    });
  }

  /**
   * Setup autocomplete for hobby field
   */
  private setupHobbyAutocomplete(): void {
    const hobbyControl = this.profileForm.get('hobby');
    if (hobbyControl) {
      this.filteredHobbies = hobbyControl.valueChanges.pipe(
        startWith(''),
        map((value: string) => this.filterHobbies(value)),
        takeUntil(this.destroy$)
      );
    }
  }

  /**
   * Filter hobbies based on input value
   */
  private filterHobbies(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.hobbies.filter(hobby => 
      hobby.toLowerCase().includes(filterValue) && 
      !this.selectedHobbies.includes(hobby)
    );
  }

  /**
   * Add hobby from chip input
   */
  addHobby(event: any): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedHobbies.includes(value)) {
      this.selectedHobbies.push(value);
    }
    // Clear input after adding
    event.chipInput!.clear();
    this.profileForm.get('hobby')?.setValue('');
    // Focus input after adding
    setTimeout(() => this.focusInput(), 100);
  }

  /**
   * Remove hobby from chips by index
   */
  removeHobbyByIndex(index: number): void {
    if (index >= 0 && index < this.selectedHobbies.length) {
      this.selectedHobbies.splice(index, 1);
      
      // Trigger autocomplete update
      const hobbyControl = this.profileForm.get('hobby');
      if (hobbyControl) {
        hobbyControl.setValue(hobbyControl.value);
      }
      
      // Focus input after removing
      setTimeout(() => this.focusInput(), 100);
    }
  }

  /**
   * Handle option selection from autocomplete
   */
  onOptionSelected(event: any): void {
    const hobby = event.option.value;
    if (!this.selectedHobbies.includes(hobby)) {
      this.selectedHobbies.push(hobby);
    }
    // Clear input after selecting
    this.profileForm.get('hobby')?.setValue('');
    
    // Focus input after selecting
    setTimeout(() => this.focusInput(), 100);
  }

  /**
   * Custom validator for age (must be 18+ for DUI)
   */
  private ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null;
    
    const birthday = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    
    return age >= 0 ? null : { invalidAge: true };
  }

  /**
   * Custom validator for document format
   */
  private documentValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null;
    
    const document = control.value.replace(/[-\s]/g, '');
    
    // DUI format: 8 digits + 1 digit
    const duiPattern = /^\d{8}\d{1}$/;
    
    // Carnet de minoridad format: variable length
    const carnetPattern = /^\d{6,10}$/;
    
    if (duiPattern.test(document) || carnetPattern.test(document)) {
      return null;
    }
    
    return { invalidFormat: true };
  }

  /**
   * Format document input with hyphens
   */
  formatDocument(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d]/g, '');
    
    // Add hyphens for DUI format
    if (value.length >= 8) {
      value = value.slice(0, 8) + '-' + value.slice(8);
    }
    
    this.profileForm.patchValue({ document: value });
  }

  /**
   * Handle file selection for profile image
   */
  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum 5MB.');
      return;
    }

    this.selectedFileName = file.name;

    // Create and save thumbnail
    this.profileImage = await createThumbnail(file, 100, 0.7);
  }

  /**
   * Remove selected image
   */
  removeImage(): void {
    this.profileImage = null;
    this.selectedFileName = null;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    console.log('Errors', this.profileForm.errors)
    if (this.profileForm.valid) {
      const profileData: TrainerProfile = {
        name: this.profileForm.get('name')?.value,
        hobbies: this.selectedHobbies,
        birthday: this.profileForm.get('birthday')?.value,
        document: this.profileForm.get('document')?.value,
        profileImage: this.profileImage || undefined
      };

      // Convert to store format
      const storeProfile: StoreTrainerProfile = {
        name: profileData.name,
        hobby: profileData.hobbies?.join(', ') || '',
        age: this.calculateAge(profileData.birthday) + ' años',
        document: profileData.document,
        profileImage: profileData.profileImage
      };

      // Update store
      this.trainerStore.updateProfile(storeProfile);
      
      // Navigate to loading screen first
      this.router.navigate(['/loading']);
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Focus the input field
   */
  private focusInput(): void {
    if (this.hobbyInput && this.hobbyInput.nativeElement) {
      this.hobbyInput.nativeElement.focus();
      // Move cursor to end of input
      const input = this.hobbyInput.nativeElement;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  /**
   * Calculate age from birthday
   */
  private calculateAge(birthday: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Handle back button click
   */
  onBackClick(): void {
    // Navigate back or handle as needed
    console.log('Back button clicked');
  }

  get documentLabel(): string {
    const birthday = this.profileForm?.get('birthday')?.value;
    if (!birthday) return 'DUI';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18 ? 'DUI' : 'Carnet de minoridad';
  }
}
