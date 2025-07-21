import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface PokemonApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonApiResult[];
}

export interface PokemonApiResult {
  name: string;
  url: string;
}

export interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
  effort: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      'home': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: PokemonStat[];
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  selected?: boolean;
}

export const STAT_LIMITS = {
  hp: 255,
  attack: 190,
  defense: 230,
  specialAttack: 194,
  specialDefense: 230,
  speed: 180
} as const;

export const TYPE_TRANSLATIONS: { [key: string]: string } = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada'
};

export function translateType(type: string): string {
  return TYPE_TRANSLATIONS[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getPokemonList(limit: number = 151, offset: number = 0): Observable<Pokemon[]> {
    const url = `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`;
    
    return this.http.get<PokemonApiResponse>(url).pipe(
      map((response: PokemonApiResponse) => response.results.slice(0, 9)), // Get first 9 for demo
      switchMap((results: PokemonApiResult[]) => {
        const requests = results.map((result: PokemonApiResult) => this.getPokemonDetail(result.name));
        return forkJoin(requests);
      }),
      map((pokemonDetails: PokemonDetail[]) => 
        pokemonDetails.map((detail: PokemonDetail) => this.mapPokemonDetail(detail))
      )
    );
  }

  getPokemonDetail(name: string): Observable<PokemonDetail> {
    const url = `${this.baseUrl}/pokemon/${name}`;
    return this.http.get<PokemonDetail>(url);
  }

  searchPokemon(query: string): Observable<Pokemon[]> {
    if (!query.trim()) {
      return this.getPokemonList(9, 0);
    }

    return this.getPokemonDetail(query.toLowerCase()).pipe(
      map((detail: PokemonDetail) => [this.mapPokemonDetail(detail)])
    );
  }

  private mapPokemonDetail(detail: PokemonDetail): Pokemon {
    const stats = this.mapStats(detail.stats);
    
    return {
      id: detail.id,
      name: this.capitalizeFirstLetter(detail.name),
      image: detail.sprites.other['home'].front_default || detail.sprites.front_default,
      types: detail.types.map(type => type.type.name),
      stats: stats,
      selected: false
    };
  }


  private mapStats(apiStats: PokemonStat[]): Pokemon['stats'] {
    const statsMap = new Map<string, number>();
    
    apiStats.forEach(stat => {
      const statName = this.normalizeStatName(stat?.stat?.name);
      if (statName) {
        statsMap.set(statName, stat.base_stat);
      }
    });

    return {
      hp: this.validateStat(statsMap.get('hp') || 0, STAT_LIMITS.hp),
      attack: this.validateStat(statsMap.get('attack') || 0, STAT_LIMITS.attack),
      defense: this.validateStat(statsMap.get('defense') || 0, STAT_LIMITS.defense),
      specialAttack: this.validateStat(statsMap.get('special-attack') || 0, STAT_LIMITS.specialAttack),
      specialDefense: this.validateStat(statsMap.get('special-defense') || 0, STAT_LIMITS.specialDefense),
      speed: this.validateStat(statsMap.get('speed') || 0, STAT_LIMITS.speed)
    };
  }


  private validateStat(value: number, maxLimit: number): number {
    return Math.min(value, maxLimit);
  }

  private normalizeStatName(apiStatName: string): string | null {
    const statMapping: { [key: string]: string } = {
      'hp': 'hp',
      'attack': 'attack',
      'defense': 'defense',
      'special-attack': 'special-attack',
      'special-defense': 'special-defense',
      'speed': 'speed'
    };
    
    return statMapping[apiStatName] || null;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
