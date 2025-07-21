import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pokemon, PokemonService } from '../../shared/pokemon.service';
import { TrainerStore } from '../../../store/trainer';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

interface ProfileInfo {
  name?: string;
  hobby?: string;
  age?: string;
  document?: string;
  image?: string;
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
    document: '05643215-9',
  };

  pokemonList: Pokemon[] = [];
  filteredPokemonList: Pokemon[] = [];
  selectedPokemon: Pokemon[] = [];
  loading: boolean = false;
  searchQuery: string = '';
  searchControl = new FormControl('');

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private trainerStore: TrainerStore
  ) { }

  ngOnInit(): void {
    // 1. Suscríbete a los seleccionados
    this.trainerStore.selectedPokemon$.subscribe(selected => {
      this.selectedPokemon = selected;
      this.syncSelectedState();
    });

    // Debounced search


    // Carga inicial
    this.loadPokemonList();

    // Filtrado local reactivo
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        this.filterPokemon(query);
      });

    this.trainerStore.profile$.pipe(takeUntil(this.destroy$)).subscribe((profile) => {
      if (profile) {
        this.profileInfo = {
          name: profile.name,
          hobby: profile.hobby,
          age: profile.age,
          document: profile.document,
          image: profile.profileImage
        };
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  loadPokemonList() {
    this.loading = true;
    this.pokemonService.getPokemonList().subscribe(list => {
      this.pokemonList = list;
      this.filteredPokemonList = list;
      this.syncSelectedState();
      this.loading = false;
    });
  }

  filterPokemon(query: string): void {
    if (!query || !query.trim()) {
      this.filteredPokemonList = this.pokemonList;
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredPokemonList = this.pokemonList.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.id.toString().padStart(3, '0').includes(lowerQuery)
      );
    }
    this.syncSelectedState();
  }

  syncSelectedState() {
    if (!this.pokemonList.length) return;
    const selectedIds = new Set(this.selectedPokemon.map(p => p.id));
    // Marca en la lista original
    this.pokemonList.forEach(p => {
      p.selected = selectedIds.has(p.id);
    });
    // Marca en la lista filtrada
    this.filteredPokemonList.forEach(p => {
      p.selected = selectedIds.has(p.id);
    });
  }

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
    if (!this.selectedPokemon.some(p => p.id === pokemon.id)) {
      this.selectedPokemon.push(pokemon);
    }
    this.syncSelectedState();
  }

  onPokemonDeselected(pokemon: Pokemon): void {
    this.selectedPokemon = this.selectedPokemon.filter(p => p.id !== pokemon.id);
    this.syncSelectedState();
  }

  onBackClick(): void {
    console.log('Back button clicked');
  }

  onSave(): void {
    console.log('Selected Pokémon:', this.selectedPokemon);

    // Update store with selected Pokémon
    this.trainerStore.setSelectedPokemon(this.selectedPokemon);

    // Set loading state
    this.trainerStore.setLoading(true);

    // Navigate to loading screen first, then to dashboard
    this.router.navigate(['/loading']);

    // Simulate loading time and then navigate to dashboard
    setTimeout(() => {
      this.trainerStore.setLoading(false);
      this.router.navigate(['/dashboard']);
    }, 3000); // 3 seconds loading time
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

}
