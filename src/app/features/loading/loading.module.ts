import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LoadingComponent } from './loading/loading.component';

const routes: Routes = [
  {
    path: '',
    component: LoadingComponent
  }
];

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LoadingModule { }
