import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pokemon } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.sass']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() selectable: boolean = false;
  @Input() maxSelections: number = 3;
  @Input() selectedCount: number = 0;

  @Output() pokemonSelected = new EventEmitter<Pokemon>();
  @Output() pokemonDeselected = new EventEmitter<Pokemon>();

  get canSelect(): boolean {
    return this.selectable && (this.pokemon.selected || this.selectedCount < this.maxSelections);
  }

  onCardClick(): void {
    if (!this.selectable || !this.canSelect) {
      return;
    }

    if (this.pokemon.selected) {
      this.pokemon.selected = false;
      this.pokemonDeselected.emit(this.pokemon);
    } else {
      this.pokemon.selected = true;
      this.pokemonSelected.emit(this.pokemon);
    }
  }
}
