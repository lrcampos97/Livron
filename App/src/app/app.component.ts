import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './models/Usuario.interface';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Estante',
      url: '/estante',
      icon: 'book'
    }    
  ];

  usuario: Usuario = {    
    NOME: 'LUIZ',
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


  rate: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private userService: UsuarioService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
        this.userService.getUsuarioLogado();

        this.router.navigateByUrl('/welcome');
        
        this.statusBar.styleDefault();
        this.splashScreen.hide();                  
    });
  }
  
  ranking(){
    this.router.navigateByUrl('/ranking');
  }
  
  menuOpened(){
    console.log('abriu menu');
  }

  ionDidOpen(){
    console.log('agora abriu');
  }

  logout(){
    this.userService.logout().then(() => {
      this.router.navigateByUrl('/welcome');
    })        
  }
}
