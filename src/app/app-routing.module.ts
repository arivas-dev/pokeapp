import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/profile',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'pokemon-team',
    loadChildren: () => import('./features/pokemon-team/pokemon-team.module').then(m => m.PokemonTeamModule)
  },
  {
    path: 'loading',
    loadChildren: () => import('./features/loading/loading.module').then(m => m.LoadingModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/trainer-dashboard/trainer-dashboard.module').then(m => m.TrainerDashboardModule)
  },
  {
    path: '**',
    redirectTo: '/profile'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
