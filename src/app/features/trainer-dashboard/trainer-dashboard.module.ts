import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Angular Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Shared module
import { SharedModule } from '../shared/shared.module';

// Layout module
import { LayoutModule } from '../../layout/layout.module';

// Components
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: TrainerDashboardComponent
  }
];

@NgModule({
  declarations: [
    TrainerDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatButtonModule,
    SharedModule,
    LayoutModule
  ]
})
export class TrainerDashboardModule { }
