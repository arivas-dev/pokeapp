import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  selected?: boolean;
}

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.sass']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() selectable: boolean = true;
  @Input() maxSelections: number = 3;
  @Input() selectedCount: number = 0;
  
  @Output() pokemonSelected = new EventEmitter<Pokemon>();
  @Output() pokemonDeselected = new EventEmitter<Pokemon>();

  onCardClick(): void {
    if (!this.selectable) return;
    
    if (this.pokemon.selected) {
      this.pokemonDeselected.emit(this.pokemon);
    } else if (this.selectedCount < this.maxSelections) {
      this.pokemonSelected.emit(this.pokemon);
    }
  }

  get canSelect(): boolean {
    return this.selectable && (!this.pokemon.selected && this.selectedCount < this.maxSelections);
  }
}
