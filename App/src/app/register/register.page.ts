import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, NavController, ModalController, LoadingController } from '@ionic/angular';
import { Usuario } from '../models/Usuario.interface';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { AlertService } from '../services/alert.service';
import { UsuarioConquistasService } from '../services/usuario-conquistas.service';

const LAZYBONE = 'assets/img/avatar/avatar_lazybones_64.png';
const GIRLS = 'assets/img/avatar/avatar_girl_64.png';
const MALE = 'assets/img/avatar/avatar_male_64.png';
const BATMAN = 'assets/img/avatar/avatar_batman_64.png';
const ZOMBIE = 'assets/img/avatar/avatar_zombie_64.png';
const COFFE = 'assets/img/avatar/avatar_coffe_64.png';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

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

  public avatar: any; 
  public register: FormGroup;

  constructor(private fBuilder: FormBuilder, 
              public menuCtrl: MenuController, 
              private userServ: UsuarioService,
              private storage: Storage,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private navCtrl: NavController,
              private alert: AlertService,
              private usuarioConquista: UsuarioConquistasService) {

    this.register = this.fBuilder.group({
      'usuario': ['', Validators.compose([
        Validators.required
      ])],
      'senha': ['', Validators.compose([
        Validators.required
      ])],
      'nome': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.required
      ])]
    })

  }

  ngOnInit() {
  }
  
  // Dismiss Login Modal
  dismissRegister() {
    this.modalController.dismiss();
  }  

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async cadastrar() {
    const loading = await this.loadingController.create({
      message: 'Validando informações...',
    });   

    await loading.present();

    this.usuario.NOME = this.register.value['nome'];
    this.usuario.SENHA = this.register.value['senha'];
    this.usuario.EMAIL = this.register.value['email'];
    this.usuario.LOGIN = this.register.value['usuario'];
    this.usuario.AVATAR = this.avatar;    

    console.log(this.usuario);

    this.userServ.addUsuario(this.usuario).subscribe((data) => {       
      
      this.usuario.USUARIO_ID = data;
      
      this.storage.set(environment.USER_STORAGE, JSON.stringify(this.usuario))
      .then(
        () => {
          this.userServ.usuarioLogadoId = data;          
          this.userServ.usuario = this.usuario;

          // Falar da conquista
          this.usuarioConquista.addPrimeiroAcesso(data).subscribe((result) => {
            console.log(result);
          }, erro => {
            console.log(erro);
          });

        },
        error => console.error('Error storing item', error)
      );
      
      this.storage.set('PRIMEIRO_ACESSO', true);  

      this.dismissRegister();
      loading.dismiss();
      this.navCtrl.navigateRoot('/home');
      
    }, err => {      
      this.alert.presentErrorToast('Erro ao gravar usuário!')          
      loading.dismiss();
      console.log(err);
    })

  }

  setAvatar(param) {
    switch (param) {
      case 0: {
        this.avatar = LAZYBONE;
        break;
      }
      case 1: {
        this.avatar = GIRLS;
        break;
      }
      case 2: {
        this.avatar = MALE;
        break;
      }
      case 3: {
        this.avatar = BATMAN;
        break;
      }
      case 4: {
        this.avatar = ZOMBIE;
        break;
      }
      case 5: {
        this.avatar = COFFE;
        break;
      }
    }
  }
}
