import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController, LoadingController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { RegisterPage } from '../register/register.page';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(public menuCtrl: MenuController,
              private modalController: ModalController,
              private navCtrl: NavController,
              private usuarioServ: UsuarioService,
              private loadingController: LoadingController) {
      
      this.menuCtrl.enable(false);
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.testarLogin();
  }

  async testarLogin(){
    const loading = await this.loadingController.create({
      message: 'Carregando...',
    });   

    await loading.present();

    this.usuarioServ.getUsuarioLogado().then(() => {
      if (this.usuarioServ.estaLogado){
        this.navCtrl.navigateRoot('/home');
        loading.dismiss();
      } else {
        loading.dismiss();
      }
    }, erro => {
      loading.dismiss();
    }) 
  }

  async register() {
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }
  async login() {
    const loginModal = await this.modalController.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }



}
