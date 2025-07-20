import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pokemon } from '../../shared/pokemon.service';
import { TrainerStore } from '../../../store/trainer';

interface TrainerProfile {
  name: string;
  hobby: string;
  age: string;
  document: string;
  profileImage?: string;
}

@Component({
  selector: 'app-trainer-dashboard',
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['./trainer-dashboard.component.sass']
})
export class TrainerDashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  trainerProfile: TrainerProfile = {
    name: 'José',
    hobby: 'Ver Series',
    age: '26 años',
    document: '05634225-1',
    profileImage: 'assets/profile-placeholder.png'
  };

  selectedPokemon: Pokemon[] = [];

  constructor(
    private trainerStore: TrainerStore
  ) { }

  ngOnInit(): void {
    // Subscribe to store data
    this.trainerStore.profile$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((profile: TrainerProfile | null) => {
      if (profile) {
        this.trainerProfile = profile;
      }
    });

    this.trainerStore.selectedPokemon$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((pokemon: Pokemon[]) => {
      this.selectedPokemon = pokemon;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEditProfile(): void {
    console.log('Edit profile clicked');
    // TODO: Navigate to profile form
  }

  onEditPokemon(): void {
    console.log('Edit Pokémon clicked');
    // TODO: Navigate to Pokémon selection
  }

  onSearch(): void {
    console.log('Search clicked');
    // TODO: Implement search functionality
  }

  onProfileDropdown(): void {
    console.log('Profile dropdown clicked');
    // TODO: Show profile dropdown menu
  }


}
