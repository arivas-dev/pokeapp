import { Component, OnInit, OnDestroy } from '@angular/core';
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

  constructor(private trainerStore: TrainerStore) { }

  ngOnInit(): void {
    // Subscribe to trainer profile from store
    this.trainerStore.profile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((profile: any) => {
      if (profile) {
        this.trainerName = profile.name;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onProfileDropdown(): void {
    console.log('Profile dropdown clicked');
    // TODO: Show profile dropdown menu
  }

  onSearch(): void {
    console.log('Search clicked');
    // TODO: Implement search functionality
  }
}
