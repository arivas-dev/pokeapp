import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pokemon, PokemonService } from '../../shared/pokemon.service';

interface ProfileInfo {
  name?: string;
  hobby?: string;
  age?: string;
  document?: string;
}

@Component({
  selector: 'app-pokemon-selection',
  templateUrl: './pokemon-selection.component.html',
  styleUrls: ['./pokemon-selection.component.sass']
})
export class PokemonSelectionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  profileInfo: ProfileInfo = {
    name: 'José Sosa',
    hobby: 'Ver Series',
    age: '18 años',
    document: '05643215-9'
  };

  pokemonList: Pokemon[] = [];
  selectedPokemon: Pokemon[] = [];
  loading: boolean = false;
  searchQuery: string = '';

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPokemon();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load Pokémon from API
   */
  loadPokemon(): void {
    this.loading = true;
    this.pokemonService.getPokemonList(9, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pokemon: Pokemon[]) => {
          this.pokemonList = pokemon;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading Pokémon:', error);
          this.loading = false;
        }
      });
  }

  /**
   * Handle search input event
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchPokemon(target.value);
  }

  /**
   * Search Pokémon by name
   */
  searchPokemon(query: string): void {
    this.searchQuery = query;
    if (!query.trim()) {
      this.loadPokemon();
      return;
    }

    this.loading = true;
    this.pokemonService.searchPokemon(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pokemon: Pokemon[]) => {
          this.pokemonList = pokemon;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error searching Pokémon:', error);
          this.loading = false;
          // Fallback to original list on error
          this.loadPokemon();
        }
      });
  }

  onPokemonSelected(pokemon: Pokemon): void {
    pokemon.selected = true;
    this.selectedPokemon.push(pokemon);
  }

  onPokemonDeselected(pokemon: Pokemon): void {
    pokemon.selected = false;
    this.selectedPokemon = this.selectedPokemon.filter(p => p.id !== pokemon.id);
  }

  onBackClick(): void {
    console.log('Back button clicked');
  }

  onSave(): void {
    console.log('Selected Pokémon:', this.selectedPokemon);
    
    // Save selected Pokémon to localStorage
    localStorage.setItem('selectedPokemon', JSON.stringify(this.selectedPokemon));
    
    // Navigate to loading screen first, then to dashboard
    this.router.navigate(['/loading']);
    
    // Simulate loading time and then navigate to dashboard
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 3000); // 3 seconds loading time
  }
}
