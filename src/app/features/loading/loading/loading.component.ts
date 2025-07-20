import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrainerStore } from '../../../store/trainer';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private trainerStore: TrainerStore
  ) { }

  ngOnInit(): void {
    // Check if we have selected Pokémon data from store
    this.trainerStore.hasSelectedPokemon$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((hasPokemon: boolean) => {
      if (hasPokemon) {
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
