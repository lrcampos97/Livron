import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EstantePage } from './estante.page';
import { BuscarLivrosPage } from '../modal/buscar-livros/buscar-livros.page';

const routes: Routes = [
  {
    path: '',
    component: EstantePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ], 
  declarations: [EstantePage, BuscarLivrosPage],
  entryComponents: [BuscarLivrosPage]
})
export class EstantePageModule {}
