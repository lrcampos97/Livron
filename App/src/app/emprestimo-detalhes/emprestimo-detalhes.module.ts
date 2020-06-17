import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmprestimoDetalhesPage } from './emprestimo-detalhes.page';

const routes: Routes = [
  {
    path: '',
    component: EmprestimoDetalhesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmprestimoDetalhesPage]
})
export class EmprestimoDetalhesPageModule {}
