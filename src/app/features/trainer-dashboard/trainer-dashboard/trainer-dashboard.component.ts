import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../shared/pokemon.service';

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
export class TrainerDashboardComponent implements OnInit {
  trainerProfile: TrainerProfile = {
    name: 'José',
    hobby: 'Ver Series',
    age: '26 años',
    document: '05634225-1',
    profileImage: 'assets/profile-placeholder.png'
  };

  selectedPokemon: Pokemon[] = [
    {
      id: 1,
      name: 'Bulbasaur',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/home/1.png',
      types: ['Planta', 'Veneno'],
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45
      },
      selected: true
    },
    {
      id: 4,
      name: 'Charmander',
      image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/home/4.png',
      types: ['Fuego'],
      stats: {
        hp: 39,
        attack: 52,
        defense: 43,
        specialAttack: 60,
        specialDefense: 50,
        speed: 65
      },
      selected: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Load trainer profile and selected Pokémon from localStorage or service
    this.loadTrainerData();
  }

  loadTrainerData(): void {
    // Load selected Pokémon from localStorage
    const selectedPokemonData = localStorage.getItem('selectedPokemon');
    if (selectedPokemonData) {
      try {
        this.selectedPokemon = JSON.parse(selectedPokemonData);
        console.log('Loaded selected Pokémon:', this.selectedPokemon);
      } catch (error) {
        console.error('Error parsing selected Pokémon data:', error);
      }
    }
    
    // Load trainer profile data from localStorage
    const trainerProfileData = localStorage.getItem('trainerProfile');
    if (trainerProfileData) {
      try {
        const profileData = JSON.parse(trainerProfileData);
        this.trainerProfile = { 
          ...this.trainerProfile, 
          name: profileData.name,
          hobby: profileData.hobbies?.join(', ') || this.trainerProfile.hobby,
          age: this.calculateAge(profileData.birthday) + ' años',
          document: profileData.document,
          profileImage: profileData.profileImage || this.trainerProfile.profileImage
        };
        console.log('Loaded trainer profile:', this.trainerProfile);
      } catch (error) {
        console.error('Error parsing trainer profile data:', error);
      }
    }
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

  /**
   * Calculate age from birthday
   */
  private calculateAge(birthday: string): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
