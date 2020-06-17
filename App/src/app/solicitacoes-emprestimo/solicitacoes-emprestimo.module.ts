import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SolicitacoesEmprestimoPage } from './solicitacoes-emprestimo.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitacoesEmprestimoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SolicitacoesEmprestimoPage]
})
export class SolicitacoesEmprestimoPageModule {}
