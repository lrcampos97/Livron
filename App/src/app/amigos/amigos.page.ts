import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario.interface';
import { ModalController, MenuController, AlertController } from '@ionic/angular';
import { SettingsPage } from '../modal/settings/settings.page';
import { UsuarioConquistasService } from '../services/usuario-conquistas.service';
import { AlertService } from '../services/alert.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { AppComponent } from '../app.component';
import { UsuarioAmigosService } from '../services/usuario-amigos.service';
import { UsuarioAmigos } from '../models/UsuarioAmigos.interface';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.page.html',
  styleUrls: ['./amigos.page.scss'],
})
export class AmigosPage implements OnInit {

  usuarioAmigo: UsuarioAmigos = {    
    USUARIO_AMIGO_ID: 0,
    USUARIO_ID: 0,
    NOME: '',
    AVATAR: ''    
  };


  private usuarioAmigos: any[] = [];
  public buscando: boolean = false;
  public qtdAmigos: number = 0;

  constructor(
              private menu: MenuController,
              private alertServ: AlertService,
              public alertController: AlertController,
              private userAmigos: UsuarioAmigosService) {
                this.menu.enable(false);
               }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.atualizarAmigos();
  }


  async atualizarAmigos(){
    this.buscando = true;

    this.usuarioAmigos = [];

    // Carregar Livros
    this.userAmigos.getUsuarioAmigos().subscribe(data => {      
      data.forEach(element => {
        this.usuarioAmigos.push(element);
      });

      this.qtdAmigos = data.length;

      this.buscando = false;

    }, erro => {
      this.alertServ.presentErrorToast('Ocorreu um erro ao carregar suas conquistas, por favor tente novamente mais tarde.');
      console.log('fudeu' + erro);
    });
  }  



  async excluirAmizade(nome,usuarioOutroId){
    const alert =  await this.alertController.create({
      header: 'Desfazer Amizade',      
      message: 'Deseja realmente desfazer a amizade com "'+nome+'" ?',
      buttons: [{
        text: 'NÃO',
        handler: () => {
          console.log('nao');  
        }
      },
      {
        text: 'SIM',
        handler: () => {
          this.userAmigos.deleteUsuarioLivro(usuarioOutroId)

          this.userAmigos.deleteUsuarioLivro(usuarioOutroId).subscribe(
            resp => {
              this.atualizarAmigos();            
            },
            error => this.alertServ.presentErrorToast('Erro ao tentar desfazer a amizade , tente novamente mais tarde.')
          );   
        }
      }
    ]
    });

    await alert.present();
  }
}
 