import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LivroDetalhesPage } from './livro-detalhes.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

const routes: Routes = [
  {
    path: '',
    component: LivroDetalhesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LivroDetalhesPage],
  providers: [SocialSharing]
})
export class LivroDetalhesPageModule {}
