import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Check if we have selected Pokémon data (coming from pokemon selection)
    const selectedPokemon = localStorage.getItem('selectedPokemon');
    
    if (selectedPokemon) {
      // If we have selected Pokémon, navigate to dashboard after loading
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 3000);
    } else {
      // Default navigation to pokemon team
      setTimeout(() => {
        this.router.navigate(['/pokemon-team']);
      }, 3000);
    }
  }

}
