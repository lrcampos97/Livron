import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuscarLivrosPage } from './buscar-livros.page';

const routes: Routes = [
  {
    path: '',
    component: BuscarLivrosPage
  }
];

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BuscarLivrosPage],
  exports: [BuscarLivrosPage]
})
export class BuscarLivrosPageModule {}
