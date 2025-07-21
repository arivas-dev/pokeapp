import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrainerStore } from '../../store/trainer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  trainerName: string = 'José';
  isProfileMenuOpen: boolean = false;
  hasProfile: boolean = false;

  constructor(
    private trainerStore: TrainerStore,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to trainer profile from store
    this.trainerStore.profile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((profile: any) => {
      if (profile) {
        this.trainerName = profile.name;
        this.hasProfile = true;
      } else {
        this.hasProfile = false;
        this.trainerName = 'José';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.header__profile-container')) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  onEditProfile(): void {
    console.log('Edit profile clicked');
    this.isProfileMenuOpen = false;
    this.router.navigate(['/profile']);
  }

  onLogout(): void {
    console.log('Logout clicked');
    this.isProfileMenuOpen = false;
    
    // Reset store state
    this.trainerStore.reset();
    
    // Navigate to profile page (login)
    this.router.navigate(['/profile']);
  }

  onSearch(): void {
    console.log('Search clicked');
    // TODO: Implement search functionality
  }
}
