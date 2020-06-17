import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LivroService } from 'src/app/services/livro.service';
import { Livro } from 'src/app/models/Livro.interface';
import { LoadingController, ActionSheetController, AlertController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { UsuarioConquistasService } from 'src/app/services/usuario-conquistas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { SolicitacaoEmprestimo } from 'src/app/models/SolicitacaoEmprestimo.interface';
import { SolicitacaoEmprestimoService } from 'src/app/services/solicitacao-emprestimo.service';
import { AlertService } from 'src/app/services/alert.service';


@Component({
  selector: 'app-livro-detalhes',
  templateUrl: './livro-detalhes.page.html',
  styleUrls: ['./livro-detalhes.page.scss'],
})
export class LivroDetalhesPage implements OnInit {
  
  solicitacao: SolicitacaoEmprestimo ={
    SOLICITACAO_EMPRESTIMO_ID: 0,
    LIVRO_ID: 0,
    PONTO_COLETA_ID: 1,
    USUARIO_SOLICITANTE_ID: 0,
    USUARIO_SOLICITADO_ID: 0,
    APROVADO: false,
    DATA_EMPRESTIMO: new Date()
  };


  livro: Livro = {
    TITULO: '',
    SUBTITULO: '',
    PAGINAS: 0,
    ISBN: '',
    ANO: 0,
    EDICAO: '', 
    EDITORA: '',
    GENERO_ID: 0,
    RESUMO: '',
    USUARIO_RESPONSAVEL_ID: 0, 
    USUARIO_PROPRIETARIO_ID: 0,
    AUTOR: '',
    IMAGEM: null,
    IMAGEM_DESCRICAO:  '',
    STATUS: ''
  };
  
  isFavorite = false;
  donoLivro: boolean = true;

  constructor(private route: ActivatedRoute, 
              public LivroService: LivroService, 
              public loadingController: LoadingController,
              public socialSharing: SocialSharing,            
              private file: File,
              private userConquista: UsuarioConquistasService,
              private userServ: UsuarioService,
              private storage: Storage,
              private router: Router,
              public alertController: AlertController,
              private solicitaEmprestimo: SolicitacaoEmprestimoService,
              private alertServ: AlertService
              ) { 

  }

  ngOnInit() {
    this.route.params.subscribe(async parametros => {
      if (parametros['id']){

        const loading = await this.loadingController.create({
          message: 'Carregando Detalhes...',
        });
        await loading.present();
          
          this.LivroService.getLivro(parametros['id']).subscribe((teste: any) => {
            this.livro = teste[0]; 
            
            if (this.livro.USUARIO_PROPRIETARIO_ID == this.userServ.usuarioLogadoId){
              this.donoLivro = true
            } else {
              this.donoLivro = false;
            }
            
            loading.dismiss();
          }, erro => {
            loading.dismiss();
            console.log(erro);
          });                               
      }
    });
  }

  async resolveLocalFile(){
    return this.file.copyFile(`${this.file.applicationDirectory}www/assets/img/` ,
                             'teste.png',
                             this.file.cacheDirectory,`${new Date().getTime()}.png`);
  }

  removeTempFile(name){
    this.file.removeFile(this.file.cacheDirectory,name);
  }


  async compartilharImagem(){
    let img = await this.resolveLocalFile();
    this.socialSharing.share('Baixe agora o App Livron, compartilhe Livros e inspire novos momentos.                   ',
                             '',
                             img.nativeURL,
                             'https://play.google.com/store/apps/details?id=tech.melo.minhaestante')
      .then(s => {
        this.file.removeFile(this.file.cacheDirectory, img.name);

        this.userConquista.getUsuarioConquista(this.userServ.usuarioLogadoId, environment.CONQUISTAS.shareLivro).subscribe((val) => {
          if (val[0].ATINGIU == 0){
            this.exibeConquista();
          }
        })

      }).catch(e => {
        alert('erro: ' + e);
      })
  }


  async exibeConquista(){
    this.userConquista.addConquista(this.userServ.usuarioLogadoId, environment.CONQUISTAS.shareLivro).subscribe((data) => {
      console.log(data);
      this.userServ.usuario.XP = Number(this.userServ.usuario.XP) + environment.CONQUISTAS_XP.shareLivro;
      this.storage.set(environment.USER_STORAGE,  JSON.stringify(this.userServ.usuario));
    });

    const alert =  await this.alertController.create({
      header: 'Compartilhar o Livron',
      subHeader: 'Obrigado !!!',
      message: 'Você acaba de receber 200XP por compartilhar o Livron com os seus amigos. Consulte suas conquistas em seu perfil. ',
      buttons: [{
        text: 'VISUALIZAR',
        handler: () => {
          this.router.navigateByUrl('/perfil');
        }
      },
      {
        text: 'ENTENDI',
        handler: () => {
          console.log('Confirm Okay');
        }
      }
    ]
    });

    await alert.present();
  }

  share(){    
    this.compartilharImagem(); 
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.isFavorite = false;
    } else {
      this.isFavorite = true;
    }
  };  


  async solicitarEmprestimo(livroId, usuarioSolicitadoId) {
    const alert = await this.alertController.create({
      header: 'Solicitação de Empréstimo',
      message:'Por favor, selecione a data na qual deseja pegar o livro emprestado.',
      inputs: [  
        {
          name: 'dataEmprestimo',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: async (data) => {
            if (data.dataEmprestimo.trim()){
              console.log(data.dataEmprestimo);
              
              this.solicitacao.LIVRO_ID =  livroId;
              this.solicitacao.DATA_EMPRESTIMO = data.dataEmprestimo;
              this.solicitacao.USUARIO_SOLICITADO_ID = usuarioSolicitadoId;
              this.solicitacao.USUARIO_SOLICITANTE_ID = this.userServ.usuarioLogadoId;

              const loading = await this.loadingController.create({
                message: 'Enviando Solicitação...',
              });      
                    
              await loading.present();

              this.solicitaEmprestimo.solicitarEmprestimo(this.solicitacao).subscribe(data => {
                console.log(data);
                loading.dismiss();
                this.alertServ.presentSuccessToast('Solicitação de Empréstimo realizada com sucesso.')
              }, erro => {
                loading.dismiss();
                this.alertServ.presentErrorToast('Erro ao realizar a solicitação, por favor tente mais tarde.');
              });

              
            } else {
              this.alertServ.presentErrorToast('Data inválida, tente novamente.');
            }
          }
        }
      ]
    });

    await alert.present();
  }  

}
