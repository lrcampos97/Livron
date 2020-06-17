import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EmprestimosService } from '../services/emprestimos.service';
import { SolicitacaoEmprestimoService } from '../services/solicitacao-emprestimo.service';
import { AlertService } from '../services/alert.service';
import { Emprestimos } from '../models/Emprestimos.interface';
import { UsuarioConquistas } from '../models/UsuarioConquistas.interface';
import { Storage } from '@ionic/storage';
import { UsuarioConquistasService } from '../services/usuario-conquistas.service';
import { UsuarioService } from '../services/usuario.service';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { LivroService } from '../services/livro.service';

@Component({
  selector: 'app-solicitacoes-emprestimo',
  templateUrl: './solicitacoes-emprestimo.page.html',
  styleUrls: ['./solicitacoes-emprestimo.page.scss'],
})
export class SolicitacoesEmprestimoPage implements OnInit {


  emprestimo: Emprestimos = {
    LIVRO_ID: 0,
    PONTO_COLETA_ID: 1,
    USUARIO_RESPONSAVEL_ID: 0,
    USUARIO_PROPRIETARIO_ID: 0,
    DATA_EMPRESTIMO: new Date,
    DATA_ENTREGA: new Date,
    OBS: ''
  };

  private recebidas: any[] = [];
  private enviadas: any[] = [];
  public tipos: any = 0;
  public buscando: boolean = false;

  constructor(private emprestimoServ: EmprestimosService, 
              private router: Router, 
              private menu: MenuController,
              private solicitaEmprestimo: SolicitacaoEmprestimoService,
              private alertServ: AlertService,
              private alertController: AlertController,
              private loadingController: LoadingController,
              private userConquista: UsuarioConquistasService,
              private userServ: UsuarioService,
              private app: AppComponent,
              private storage: Storage,
              private livroServ: LivroService) {
                this.tipos = 0;
               }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.atualizarSolicitacoes();  
  }

  async atualizarSolicitacoes(){
    this.buscando = true;

    if(this.tipos == 0){
      this.recebidas = [];

      this.solicitaEmprestimo.getSolicitacoesRecebidas().subscribe(data =>{
        data.forEach(element => {
       
            this.recebidas.push(element);
       
        });
        this.buscando = false;
      }, erro => {
        console.log(erro);
        this.alertServ.presentErrorToast('Erro ao consultar novas solicitações, tente novamente mais tarde.');
        this.buscando = false;
      })
    } else {
      this.enviadas = [];

      this.solicitaEmprestimo.getSolicitacoesEnviadas().subscribe(data =>{
        data.forEach(element => {
          this.enviadas.push(element);
        });
        this.buscando = false;
      }, erro => {
        console.log(erro);
        this.alertServ.presentErrorToast('Erro ao consultar suas solicitações, tente novamente mais tarde.');
        this.buscando = false;
      })      
    }
  }

  segmentChanged(event) {
    this.atualizarSolicitacoes();
  }


  async cancelarSolicitacao(solicitacaoEmprestimoId){
    const alert =  await this.alertController.create({
      header: 'Cancelar Solicitação',
      message: 'Você realmente deseja cancelar a sua solicitação de empréstimo do livro ?',
      buttons: [{
        text: 'NÃO',
        handler: () => {
          console.log('NÃO');  
        }
      },
      {
        text: 'SIM',
        handler: () => {
          this.solicitaEmprestimo.cancelarSolicitacaoEmprestimo(solicitacaoEmprestimoId).subscribe(data =>{
            this.atualizarSolicitacoes();
            this.alertServ.presentSuccessToast('Solicitação cancelada com sucesso.');            
          }, erro => {
            this.alertServ.presentErrorToast('Erro ao tentar cancelar a solicitação, tente novamente mais tarde.')
          })
        }
      }
    ]
    });

    await alert.present();
  }

  async aceitarSolicitacao(solicitacao){
    const alert =  await this.alertController.create({
      header: 'Aceitar Solicitação',
      message: 'Deseja realmente aceitar o empréstimo deste livro ?',
      buttons: [{
        text: 'NÃO',
        handler: () => {
          console.log('NÃO');  
        }
      },
      {
        text: 'SIM',
        handler: () => {
          this.solicitaEmprestimo.solicitacaoAprovada(solicitacao.SOLICITACAO_EMPRESTIMO_ID,true).subscribe(async data =>{                                 
            const alert = await this.alertController.create({
              header: 'Confirmação de empréstimo',
              message:'Por favor, selecione a data de entrega estimada, caso necessário inclua uma observação ao empréstimo',
              inputs: [  
                {
                  name: 'dataEntrega',
                  type: 'date'
                },
                {
                  name: 'obs',
                  type: 'text',
                  placeholder: 'Observação...'
                }
              ],
              buttons: [
                 {
                  text: 'Confirmar',
                  handler: async (data) => {
                    if (data.dataEntrega.trim()){
                                           
                      this.emprestimo.DATA_EMPRESTIMO = solicitacao.DATA_EMPRESTIMO;                        
                      this.emprestimo.OBS = data.obs;
                      this.emprestimo.PONTO_COLETA_ID = 1;
                      this.emprestimo.LIVRO_ID = solicitacao.LIVRO_ID;
                      this.emprestimo.USUARIO_PROPRIETARIO_ID = solicitacao.USUARIO_SOLICITADO_ID;
                      this.emprestimo.USUARIO_RESPONSAVEL_ID = solicitacao.USUARIO_SOLICITANTE_ID; 

        
                      const loading = await this.loadingController.create({
                        message: 'Confirmando empréstimo...',
                      });      
                            
                      await loading.present();
        
                      
                      this.emprestimoServ.addEmprestimo(this.emprestimo).subscribe(data => {
                        this.solicitaEmprestimo.cancelarSolicitacaoEmprestimo(solicitacao.SOLICITACAO_EMPRESTIMO_ID).subscribe(data => {

                          // Dar pontuacao para quem pegou o livro emprestado 
                          this.userConquista.getUsuarioConquistas(this.userServ.usuarioLogadoId).subscribe((val) => {
                            val.forEach(element => {
                      
                              if (element.ATINGIU == false){
                                if (element.CONQUISTA_ID == environment.CONQUISTAS.primeiroEmprestimo){
                      
                                  this.exibeConquista('Primeiro Empréstimo',
                                  'Parabéns !!',
                                  'Você acaba de receber 300XP por realizar o seu primeiro empréstimo de livro, continue assim e fique de olho em suas próximas conquistas. ;) ',
                                  environment.CONQUISTAS.primeiroEmprestimo,
                                  environment.CONQUISTAS_XP.primeiroEmprestimo);
                      
                                };
                              }
                            });                                                       
                          })
            
                          loading.dismiss();                 
                          this.atualizarSolicitacoes();       
                          this.alertServ.presentSuccessToast('Empréstimo realizado com sucesso.');
                        }, erro => {
                          loading.dismiss();
                          console.log(erro);
                          this.alertServ.presentErrorToast('Erro ao finalizar solicitação, tente novamente mais tarde.');
                        });

                        
                        this.livroServ.atualizarStatusLivro(this.emprestimo.LIVRO_ID, 'I').subscribe(data => {
                          console.log(data);
                        }, erro => {
                          console.log(erro);
                        })

                      }, erro => {
                        loading.dismiss();
                        console.log(erro);
                        this.alertServ.presentErrorToast('Erro ao confirmar empréstimo, tente novamente mais tarde.');
                      });
                              
                    } else {
                      this.alertServ.presentErrorToast('Dados inválidos, tente novamente.');
                    }
                  }
                }
              ]
            });
        
            await alert.present();

            this.atualizarSolicitacoes();                     
          }, erro => {
            this.alertServ.presentErrorToast('Erro ao tentar aceitar a solicitação, tente novamente mais tarde.')
          })
        }
      }
    ]
    });

    await alert.present();
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

  async recusarSolicitacao(solicitacaoEmprestimoId){
    const alert =  await this.alertController.create({
      header: 'Aceitar Solicitação',
      message: 'Deseja realmente recusar o empréstimo deste livro ?',
      buttons: [{
        text: 'NÃO',
        handler: () => {
          console.log('NÃO');  
        }
      },
      {
        text: 'SIM',
        handler: () => {
          this.solicitaEmprestimo.cancelarSolicitacaoEmprestimo(solicitacaoEmprestimoId).subscribe(data =>{
            this.atualizarSolicitacoes();
            this.alertServ.presentSuccessToast('Solicitação recusada com sucesso.');            
          }, erro => {
            this.alertServ.presentErrorToast('Erro ao tentar recusar a solicitação, tente novamente mais tarde.')
          })
        }
      }
    ]
    });

    await alert.present();
  }  


}
