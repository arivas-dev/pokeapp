import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../shared/pokemon-card/pokemon-card.component';

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
export class PokemonSelectionComponent implements OnInit {
  profileInfo: ProfileInfo = {
    name: 'José Sosa',
    hobby: 'Ver Series',
    age: '18 años',
    document: '05643215-9'
  };

  pokemonList: Pokemon[] = [
    { id: 1, name: 'Bulbasaur', image: 'assets/pokemon/bulbasaur.png', selected: false },
    { id: 2, name: 'Ivysaur', image: 'assets/pokemon/ivysaur.png', selected: false },
    { id: 3, name: 'Venusaur', image: 'assets/pokemon/venusaur.png', selected: false },
    { id: 4, name: 'Charmander', image: 'assets/pokemon/charmander.png', selected: false },
    { id: 5, name: 'Charmeleon', image: 'assets/pokemon/charmeleon.png', selected: false },
    { id: 6, name: 'Charizard', image: 'assets/pokemon/charizard.png', selected: false },
    { id: 7, name: 'Squirtle', image: 'assets/pokemon/squirtle.png', selected: false },
    { id: 8, name: 'Wartortle', image: 'assets/pokemon/wartortle.png', selected: false },
    { id: 9, name: 'Blastoise', image: 'assets/pokemon/blastoise.png', selected: false }
  ];

  selectedPokemon: Pokemon[] = [];

  constructor() { }

  ngOnInit(): void {
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
}
