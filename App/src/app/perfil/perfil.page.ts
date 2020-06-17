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

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {



  usuario: Usuario = {    
    NOME: '',
    LOGIN: '',
    EMAIL: '',
    SENHA: '',
    SEXO: '',
    TELEFONE: '',
    PERFIL_ID: 1,
    AVATAR: '',
    XP: 0,
    POSICAO_RANKING: 0
  };

  private usuarioConquistas: any[] = [];
  private proximasConquistas: any[] = [];
  public buscando: boolean = false;
  public usuarioAtivo: boolean = false;
  public usuarioColaborador: boolean = false;

  constructor(private userService: UsuarioService,
              private router: Router,
              private modalCtrl: ModalController,
              private menu: MenuController,
              private usuarioConquista: UsuarioConquistasService,
              private userServ: UsuarioService,
              private alertServ: AlertService,
              public alertController: AlertController,
              private storage: Storage) { 
                this.menu.enable(false);
  }

  ngOnInit() {
  }

  async atualizarConquistas(){
    this.buscando = true;

    this.usuarioConquistas = [];
    this.proximasConquistas = [];

    // Carregar Livros
    this.usuarioConquista.getUsuarioConquistas(this.userServ.usuarioLogadoId).subscribe(data => {      
      data.forEach(element => {

        if (element.ATINGIU == true && element.CONQUISTA_ID != environment.CONQUISTAS.premio1 && element.CONQUISTA_ID != environment.CONQUISTAS.premio2){ 
          this.usuarioConquistas.push(element);                
        } else  {
          if (element.CONQUISTA_ID != environment.CONQUISTAS.premio1 && element.CONQUISTA_ID != environment.CONQUISTAS.premio2) {
            this.proximasConquistas.push(element);
          }
        }
      });
        
      this.buscando = false;

    }, erro => {
      this.alertServ.presentErrorToast('Ocorreu um erro ao carregar suas conquistas, por favor tente novamente mais tarde.');
      console.log('fudeu' + erro);
    });
  }

  logout(){
    this.userService.logout().then(() => {
      this.router.navigateByUrl('/welcome');
    })        
  }

  ionViewWillEnter(){
    this.storage.get(environment.USER_STORAGE).then((val) => {
      let user = JSON.parse(val);      
      this.userServ.usuarioLogadoId = user.USUARIO_ID;    

      // alimentar informações menu
      if (this.userServ.usuario.AVATAR == undefined){
        this.usuario.AVATAR = user.AVATAR;
        this.usuario.NOME = user.NOME;
        this.usuario.XP = user.XP;
        this.usuario.POSICAO_RANKING = user.POSICAO_RANKING;
      } else {
        this.usuario.AVATAR = this.userServ.usuario.AVATAR;
        this.usuario.NOME = this.userServ.usuario.NOME;
        this.usuario.XP = this.userServ.usuario.XP;
        this.usuario.POSICAO_RANKING = this.userServ.usuario.POSICAO_RANKING;
      }
    });
    
    if (this.usuario.XP >= 1000) {
      this.usuarioAtivo = true
    } else if (this.usuario.XP >= 2000) {
      this.usuarioColaborador = true
    }
    this.atualizarConquistas();
  }


  ranking(){
    this.router.navigateByUrl('/ranking');
  }

  async settings(){
    const modalSettings = await this.modalCtrl.create({
      component: SettingsPage
    });

    modalSettings.present();
  }


  async showPremio(conquistaId) {

    const alert = await this.alertController.create({
      header: 'Prêmio usuário ativo',
      subHeader: 'Ops!',
      message: 'O prêmio é divulgado apenas quando você atingir a pontuação necessária :(',
      buttons: ['ENTENDI']
    });
    
    if (conquistaId == environment.CONQUISTAS.premio1){      
      if (this.usuario.XP == 1000) {
        const alert = await this.alertController.create({
          header: 'Prêmio usuário ativo',
          subHeader: 'PARABÉNSS !!!',
          message: 'O Livron agradece a sua colaboração, continue inspirando novos momentos e entre em contato com o administrador para receber seu prêmio :)',
          buttons: ['ENTENDI']
        });
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Prêmio usuário colaborador',
        subHeader: 'Ops!',
        message: 'O prêmio é divulgado apenas quando você atingir a pontuação necessária :(',
        buttons: ['ENTENDI']
      });

      if (this.usuario.XP == 2000) {
        const alert = await this.alertController.create({
          header: 'Prêmio usuário colaborador',
          subHeader: 'Parabéns \o/ | 30% OFF em compras',
          message: 'O Livron agradece a sua colaboração, continue inspirando novos momentos e entre em contato com o administrador para receber seu prêmio :)',
          buttons: ['ENTENDI']
        });
      }
    }

    await alert.present();
  }

}
