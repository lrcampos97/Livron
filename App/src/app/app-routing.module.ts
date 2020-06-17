import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', loadChildren: './home/home.module#HomePageModule'},
  { path: 'estante', loadChildren: './estante/estante.module#EstantePageModule' },
  { path: 'livro-detalhes/:id', loadChildren: './livro/livro-detalhes/livro-detalhes.module#LivroDetalhesPageModule' },
  { path: 'novo-livro/:id', loadChildren: './livro/novo-livro/novo-livro.module#NovoLivroPageModule' },
  { path: 'buscar-livros', loadChildren: './modal/buscar-livros/buscar-livros.module#BuscarLivrosPageModule' },
  { path: 'welcome', loadChildren: './welcome/welcome.module#WelcomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilPageModule' },  
  { path: 'settings', loadChildren: './modal/settings/settings.module#SettingsPageModule' },
  { path: 'ranking', loadChildren: './modal/ranking/ranking.module#RankingPageModule' },
  { path: 'amigos', loadChildren: './amigos/amigos.module#AmigosPageModule' },
  { path: 'emprestimo', loadChildren: './emprestimo/emprestimo.module#EmprestimoPageModule' },
  { path: 'emprestimo-detalhes/:id', loadChildren: './emprestimo-detalhes/emprestimo-detalhes.module#EmprestimoDetalhesPageModule' },
  { path: 'solicitacoes-emprestimo', loadChildren: './solicitacoes-emprestimo/solicitacoes-emprestimo.module#SolicitacoesEmprestimoPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
