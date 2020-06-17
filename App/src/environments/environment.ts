// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { HttpClient, HttpHeaders } from '@angular/common/http';

export const environment = {
  production: false,
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },
  
  tipoStatusLeitura: {
    Lido: 0,
    NaoLido: 1
  },

  tipoStatusEmprestimo: {
    Iniciado: 0,
    Finalizado: 1,
    AguardaRetirada: 2,
    EmAndamento: 3
  },

  httpOptions: {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  },

  URL: {  
    livro: 'LINK INDISPONÍVEL/livro',
    atualizarStatusLivro: 'LINK INDISPONÍVEL/livro/atualizarStatusLivro/',
    usuario: 'LINK INDISPONÍVEL/usuario',
    validaUsuario: 'LINK INDISPONÍVEL/usuario/validaLogin',
    usuarioLivros: 'LINK INDISPONÍVEL/usuarioLivros',
    getLivrosByUser: 'LINK INDISPONÍVEL/usuarioLivros/GetLivrosByUser/',
    getLivrosLidosByUser: 'LINK INDISPONÍVEL/usuarioLivros/GetLivrosLidosByUser/',
    getLivrosNaoLidosByUser: 'LINK INDISPONÍVEL/usuarioLivros/GetLivrosNaoLidosByUser/',
    getLivrosByLivro: 'LINK INDISPONÍVEL/usuarioLivros/GetLivrosByLivro/',
    getLivrosByProprietario: 'LINK INDISPONÍVEL/livro/getByProprietario/',
    getLivrosDisponiveis: 'LINK INDISPONÍVEL/usuario/getLivrosDisponiveis/',
    emprestimo: 'LINK INDISPONÍVEL/emprestimo',
    getEmprestimo: 'LINK INDISPONÍVEL/emprestimo/',
    emprestimoResponsavel: 'LINK INDISPONÍVEL/emprestimo/responsavel/',
    emprestimoProprietario: 'LINK INDISPONÍVEL/emprestimo/proprietario/',
    solicitarEmprestimo: 'LINK INDISPONÍVEL/emprestimo/solicitarEmprestimo',
    solicitacaoAprovada: 'LINK INDISPONÍVEL/emprestimo/solicitacaoAprovada/',
    getSolicitacoesEnviadas: 'LINK INDISPONÍVEL/emprestimo/getSolicitacoesEnviadas/',
    getSolicitacoesRecebidas: 'LINK INDISPONÍVEL/emprestimo/getSolicitacoesRecebidas/',
    cancelarSolicitacaoEmprestimo: 'LINK INDISPONÍVEL/emprestimo/cancelarSolicitacao/',
    generos: 'LINK INDISPONÍVEL/generos',
    ISBN: 'https://www.googleapis.com/books/v1/volumes?q=isbn:',
    image: 'LINK INDISPONÍVEL/livro/image',
    TITLE: 'https://www.googleapis.com/books/v1/volumes?q=',
    usuarioConquistas: 'LINK INDISPONÍVEL/usuarioConquistas/',
    usuarioAmigos: 'LINK INDISPONÍVEL/usuarioAmigos/',    
    usuarioConquista: 'LINK INDISPONÍVEL/usuarioConquista/',
    usuarioConquistasPrimeiroAcesso: 'LINK INDISPONÍVEL/usuarioConquistas/primeiroAcesso/',
    usuaroiConquistasReceberConquista: 'LINK INDISPONÍVEL/usuarioConquistas/receberConquista/',
    usuariosRanking: 'LINK INDISPONÍVEL/usuariosRanking'
  },
  CONQUISTAS: {
    primeiroAcesso: 0,
    primeiroLivro: 1,
    shareLivro: 2,
    primeiroEmprestimo: 3,
    pegarEmprestado: 4,
    premio1: 5,
    avaliarApp: 6,
    primeiroLugar: 7,
    avaliarPontoColeta: 8,
    maisEmprestimos: 9,
    premio2: 10
  },
  CONQUISTAS_XP: {
    primeiroAcesso: 100,
    primeiroLivro: 100,
    shareLivro: 200,
    primeiroEmprestimo: 300,
    pegarEmprestado: 300,    
    avaliarApp: 150,
    primeiroLugar: 200,
    avaliarPontoColeta: 250,
    maisEmprestimos: 400,    
  },
  token_google: 'Token para livros',
  STORAGE_LIVRO: 'livro_storage',
  USER_STORAGE: 'user_storage'
};
