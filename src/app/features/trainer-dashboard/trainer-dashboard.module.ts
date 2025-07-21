import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerDashboardComponent } from './trainer-dashboard/trainer-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { SwiperModule } from 'swiper/angular'; // <-- Importa SwiperModule
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';

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
    SharedModule,
    SwiperModule, // <-- Agrega SwiperModule aquí
    MatIconModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    TrainerDashboardComponent
  ]
})
export class TrainerDashboardModule { }
