import { Component, ViewChild  } from '@angular/core';
import { ToastController, AlertController, MenuController, LoadingController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { LivroService } from '../services/livro.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { UsuarioService } from '../services/usuario.service';
import { AppComponent } from '../app.component';
import { UsuarioConquistasService } from '../services/usuario-conquistas.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { UsuarioAmigosService } from '../services/usuario-amigos.service';
import { SolicitacaoEmprestimoService } from '../services/solicitacao-emprestimo.service';
import { SolicitacaoEmprestimo } from '../models/SolicitacaoEmprestimo.interface';
import { EmprestimosService } from '../services/emprestimos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  solicitacao: SolicitacaoEmprestimo ={
    SOLICITACAO_EMPRESTIMO_ID: 0,
    LIVRO_ID: 0,
    PONTO_COLETA_ID: 1,
    USUARIO_SOLICITANTE_ID: 0,
    USUARIO_SOLICITADO_ID: 0,
    APROVADO: false,
    DATA_EMPRESTIMO: new Date()
  };

  rate: any;
  data: any;
  scannedData: any;
  encodedData: '';
  encodeData: any;
  livrosDisponiveis: any[] = [];
  fakeLivros: any[] = [
    { TITULO: ''},
    { TITULO: ''},
    { TITULO: ''},
    { TITULO: ''}
  ];
  buscando: boolean = true;
  
  constructor(public barcodeCtrl: BarcodeScanner,
              private storage: Storage,
              private menu: MenuController,
              private userServ: UsuarioService, 
              private app: AppComponent,
              private userConquista: UsuarioConquistasService,
              public alertController: AlertController,
              private router: Router,
              private alertServ: AlertService,
              private userAmigo: UsuarioAmigosService,
              private solicitaEmprestimo: SolicitacaoEmprestimoService,
              private loadingController: LoadingController,
              private emprestimoServ: EmprestimosService) {
                this.menu.enable(true);
  }

  onRateChange(event) {
    console.log('Your rate:', event);
  }

  doRefresh(event) {
    this.userServ.getLivrosDisponiveis(this.userServ.usuarioLogadoId).subscribe(data => {
      data.forEach(element => {
        this.livrosDisponiveis.push(element);  
      });

      event.target.complete();
    });

  }

  ionViewWillEnter() {
    this.menu.enable(true);
    this.livrosDisponiveis = [];
    this.buscando = true;    

    this.storage.get(environment.USER_STORAGE).then((val) => {      
      if (val != null){
        let user = JSON.parse(val);      
        this.userServ.usuario = user;
        this.userServ.usuarioLogadoId = user.USUARIO_ID;    

        // alimentar informações menu
        if (this.userServ.usuario.AVATAR == undefined){
          this.app.usuario.AVATAR = user.AVATAR;
          this.app.usuario.NOME = user.NOME; 
          this.app.usuario.XP = user.XP;          
        } else {
          this.app.usuario.AVATAR = this.userServ.usuario.AVATAR;
          this.app.usuario.NOME = this.userServ.usuario.NOME;
          this.app.usuario.XP = this.userServ.usuario.XP;
        }

        // carregar livros
        this.userServ.getLivrosDisponiveis(this.userServ.usuarioLogadoId).subscribe(data => {
          data.forEach(element => {
            this.livrosDisponiveis.push(element);  
          });
        });

        // pegar a posição do usuário no ranking
        this.userServ.getRankingUsuarios().subscribe(data => {
          for (let index = 0; index < data.length; index++) {
            if (data[index].USUARIO_ID == this.userServ.usuarioLogadoId){              
              this.app.usuario.POSICAO_RANKING = data[index].POSICAO;
              this.userServ.usuario.POSICAO_RANKING = data[index].POSICAO;
              this.storage.set(environment.USER_STORAGE, JSON.stringify(this.userServ.usuario));
              break;
            }                        
          }      
        })
        
        // Validar conquistas
        this.verificarConquistas();
      } else {
        console.log('NAO CARREGOU O USER');
        this.buscando = false;
      }
    }).catch(err => {
      this.buscando = false;
      this.alertServ.presentErrorToast('Erro ao tentar consultar livros, por favor tente novamente.');              
      console.log('Error', err);
    });        
  }

  async verificarConquistas(){

    this.userConquista.getUsuarioConquistas(this.userServ.usuarioLogadoId).subscribe((val) => {
      val.forEach(element => {

        if (element.ATINGIU == false){
          if (element.CONQUISTA_ID == environment.CONQUISTAS.primeiroAcesso){

            this.exibeConquista('Seja bem-vindo(a) ao Livron',
            'Primeiro Acesso',
            'Você acaba de receber 100XP por realizar o seu primeiro acesso ao Livron, fique de olho em suas próximas conquistas. ;) ',
            environment.CONQUISTAS.primeiroAcesso,
            environment.CONQUISTAS_XP.primeiroAcesso);

          } else if (element.CONQUISTA_ID == environment.CONQUISTAS.primeiroLugar){
            let posicao = this.userServ.getPosicaoUsuarioRanking(this.userServ.usuarioLogadoId);

            if (posicao == 1){
              this.exibeConquista('1° Lugar Ranking de Leitores',
                                  'Parabéns !!!',
                                  'Você acaba de receber 200XP por chegar ao 1° lugar no Ranking de Leitores, continue assim e ajude a inspirar novos momentos. :) ',
                                  environment.CONQUISTAS.primeiroLugar,
                                  environment.CONQUISTAS_XP.primeiroLugar);            
            }
          } else if (element.CONQUISTA_ID == environment.CONQUISTAS.pegarEmprestado){

            this.emprestimoServ.getEmprestimoProprietario().subscribe(data => {
              if (data.length > 0){
                this.exibeConquista('Pegar Livro Emprestado',
                'Parabéns !!!',
                'Você acaba de receber 300XP por pegar o seu primeiro livro emprestado, continue assim e ajude a inspirar novos momentos. ;) ',
                environment.CONQUISTAS.pegarEmprestado,
                environment.CONQUISTAS_XP.pegarEmprestado);    
              }
            });        
          }
        }
      });
      this.buscando = false;                                      
    })
  }


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
                this.alertServ.presentSuccessToast('Solicitação de Empréstimo enviada com sucesso.')
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

  async addAmigo(userOutroId, userOutroLogin){
    this.userAmigo.getUsuarioAmigo(userOutroId).subscribe(async data => {
      if (data != null){
        const alert =  await this.alertController.create({
          header: 'Nova Amizade',  
          message: 'Deseja adicionar '+ userOutroLogin +' à sua rede de amigos ?',                  
          buttons: [{
            text: 'NÃO',
            handler: () => {
              console.log('Confirm Okay');
            }
          },
          {
            text: 'SIM',
            handler: () => {
              this.userAmigo.addUsuarioAmigo(userOutroId).subscribe(data => {
                console.log(data);
                this.alertServ.presentSuccessToast(userOutroLogin + ' adicionado aos amigos');
              }, erro => {
                this.alertServ.presentErrorToast('Erro ao adicionar amigo, tente novamente mais tarde.');
              })
            }
          }
        ]
        });
    
        await alert.present();

      } else {
        const alert =  await this.alertController.create({
          header: 'Importante !!',  
          message: userOutroLogin +' já faz parte da sua rede de amigos.',                  
          buttons: [{
            text: 'ENTENDI',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
        });
    
        await alert.present();
      }
    }, erro => {
      this.alertServ.presentErrorToast('Erro ao consultar lista de amigos, tente novamente mais tarde.');
    })
  }

  async exibeConquista(header,subHeader,message,conquistaId,conquistaXP){
    this.userConquista.addConquista(this.userServ.usuarioLogadoId, conquistaId).subscribe((data) => {      
      this.userServ.usuario.XP = Number(this.userServ.usuario.XP) + conquistaXP;
      
      this.storage.set(environment.USER_STORAGE, JSON.stringify(this.userServ.usuario));
            
      this.app.usuario.XP = this.userServ.usuario.XP;      
  }); 

    const alert =  await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
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

}
