import { Component, OnInit,ViewChild } from '@angular/core';
import { IonList, AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Livro } from '../models/Livro.interface';
import { UsuarioLivros } from '../models/UsuarioLivros.interface';
import { Observable } from 'rxjs';
import { UsuarioLivrosService } from '../services/usuario-livros.service';
import { LivroService } from '../services/livro.service';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/Usuario.interface';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { BuscarLivrosPage } from '../modal/buscar-livros/buscar-livros.page';
import { UsuarioService } from '../services/usuario.service';
import { AlertService } from '../services/alert.service';
import { UsuarioConquistasService } from '../services/usuario-conquistas.service';


@Component({
  selector: 'app-estante',
  templateUrl: './estante.page.html',
  styleUrls: ['./estante.page.scss'],
})
export class EstantePage implements OnInit {

  // Gets a reference to the list element
  @ViewChild('livroList') livroList: IonList;

  
  public tipos: any;  
  public toggled: boolean = false;
  data: any;
  
   private livros: any[] = [];
   private livrosLidos: any[] = [];
   private livrosNaoLidos: any[] = [];
  
  constructor(public UsuarioLivrosServ: UsuarioLivrosService,
              public LivroServ: LivroService,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,              
              public barcodeCtrl: BarcodeScanner,
              private storage: Storage,
              private router: Router,
              private modalCtrl: ModalController,
              private userServ: UsuarioService,
              private alertServ: AlertService,
              private userConquista: UsuarioConquistasService,
              public alertController: AlertController) { 
    this.toggled = false;    
  }

  async atualizarListaLivros() {
    const loading = await this.loadingController.create({
      message: 'Carregando Livros...',
    });      
          
    await loading.present();

    if (this.livroList) {
      this.livroList.closeSlidingItems();
    }

    if (this.tipos == 2){ // Carregar TODOS os livros
      this.livros = [];
      
      this.UsuarioLivrosServ.getUsuarioLivros(this.userServ.usuarioLogadoId).subscribe(data => {      
        data.forEach(element => {        
          this.livros.push(element);                
        });
        loading.dismiss();
        if (data.length == 1){
          this.userConquista.getUsuarioConquista(this.userServ.usuarioLogadoId, environment.CONQUISTAS.primeiroLivro).subscribe((val) => {
            if (val[0].ATINGIU == 0){
              this.exibeConquista();
            }
          })
        }
        console.log(this.livros);
      }, erro => {
        loading.dismiss();
      });      
    } else if (this.tipos == 1){ // Carregar os livros NÃO LIDOS
      
      this.livrosNaoLidos = [];
      
      this.UsuarioLivrosServ.getUsuarioLivrosNaoLidos(this.userServ.usuarioLogadoId).subscribe(data => {      
        data.forEach(element => {        
          this.livrosNaoLidos.push(element);                
        });
        loading.dismiss();
      }, erro => {
        loading.dismiss();
      });          

    } else if (this.tipos == 0){ // Carrega livros LIDOS
      this.livrosLidos = [];
      
      this.UsuarioLivrosServ.getUsuarioLivrosLidos(this.userServ.usuarioLogadoId).subscribe(data => {      
        data.forEach(element => {        
          this.livrosLidos.push(element);                
        });
        loading.dismiss();
      }, erro => {
        loading.dismiss();
      });      
    }
  }

  async exibeConquista(){
    this.userConquista.addConquista(this.userServ.usuarioLogadoId, environment.CONQUISTAS.primeiroLivro).subscribe((data) => {
      console.log(data);
      this.userServ.usuario.XP = Number(this.userServ.usuario.XP) + environment.CONQUISTAS_XP.primeiroLivro;
      this.storage.set(environment.USER_STORAGE,  JSON.stringify(this.userServ.usuario));
    });

    const alert =  await this.alertController.create({
      header: 'Primeiro Livro',
      subHeader: 'Parabéns !!',
      message: 'Você acaba de receber 100XP por cadastrar o seu primeiro livro. Consulte suas conquistas em seu seu perfil. ',
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

  
  segmentChanged(event) {
    this.atualizarListaLivros();
  }

  ionViewWillEnter() {
    this.atualizarListaLivros();  
  }  

  async abrirPesquisaLivros(){
    const modalLivros = await this.modalCtrl.create({
      component: BuscarLivrosPage
    });

    modalLivros.present();
  }

  ngOnInit() {  
    this.tipos = 2;          
  }

  public toggle(): void {
    this.toggled = !this.toggled;
  }   

  async excluirLivro(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    const alert = await this.alertCtrl.create({
      header: 'Exclusão de Livro',
      message: 'Você deseja excluir o livro selecionado?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {            
            slidingItem.close();
          }
        },
        {
          text: 'Excluir',
          handler: () => {
            this.LivroServ.deleteLivro(sessionData.LIVRO_ID).subscribe(
              resp => {
                this.UsuarioLivrosServ.deleteUsuarioLivro(sessionData.LIVRO_ID, this.userServ.usuarioLogadoId).subscribe(retorno => {
                  this.atualizarListaLivros()
                })                
              },
              error => this.alertServ.presentErrorToast('Erro ao tentar excluir o livro, tente novamente mais tarde.')
            );            
            slidingItem.close();            
          }
        }
      ]
    });

    await alert.present();
  }
}
