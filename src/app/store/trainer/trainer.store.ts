import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from '../../features/shared/pokemon.service';

export interface TrainerProfile {
  name: string;
  hobby: string;
  age: string;
  document: string;
  profileImage?: string;
}

export interface TrainerState {
  profile: TrainerProfile | null;
  selectedPokemon: Pokemon[];
  isLoading: boolean;
}

const initialState: TrainerState = {
  profile: null,
  selectedPokemon: [],
  isLoading: false
};

@Injectable({ providedIn: 'root' })
export class TrainerStore {
  private state$ = new BehaviorSubject<TrainerState>(initialState);

  // Selectors
  get profile$(): Observable<TrainerProfile | null> {
    return this.state$.pipe(
      map(state => state.profile)
    );
  }

  get selectedPokemon$(): Observable<Pokemon[]> {
    return this.state$.pipe(
      map(state => state.selectedPokemon)
    );
  }

  get isLoading$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.isLoading)
    );
  }

  get hasProfile$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => !!state.profile)
    );
  }

  get hasSelectedPokemon$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.selectedPokemon.length > 0)
    );
  }

  get pokemonCount$(): Observable<number> {
    return this.state$.pipe(
      map(state => state.selectedPokemon.length)
    );
  }

  // Actions
  updateProfile(profile: TrainerProfile): void {
    const currentState = this.state$.getValue();
    this.state$.next({ ...currentState, profile });
  }

  clearProfile(): void {
    const currentState = this.state$.getValue();
    this.state$.next({ ...currentState, profile: null });
  }

  selectPokemon(pokemon: Pokemon): void {
    const currentState = this.state$.getValue();
    const isAlreadySelected = currentState.selectedPokemon.some(p => p.id === pokemon.id);
    
    if (!isAlreadySelected) {
      this.state$.next({
        ...currentState,
        selectedPokemon: [...currentState.selectedPokemon, pokemon]
      });
    }
  }

  deselectPokemon(pokemonId: number): void {
    const currentState = this.state$.getValue();
    this.state$.next({
      ...currentState,
      selectedPokemon: currentState.selectedPokemon.filter(p => p.id !== pokemonId)
    });
  }

  setSelectedPokemon(pokemon: Pokemon[]): void {
    const currentState = this.state$.getValue();
    this.state$.next({ ...currentState, selectedPokemon: pokemon });
  }

  clearSelectedPokemon(): void {
    const currentState = this.state$.getValue();
    this.state$.next({ ...currentState, selectedPokemon: [] });
  }

  setLoading(isLoading: boolean): void {
    const currentState = this.state$.getValue();
    this.state$.next({ ...currentState, isLoading });
  }

  reset(): void {
    this.state$.next(initialState);
  }
} 