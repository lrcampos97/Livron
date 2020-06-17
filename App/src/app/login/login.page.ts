import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, ModalController, NavController, LoadingController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public formLogin: FormGroup;
  
  constructor(private fBuilder: FormBuilder, 
              public menuCtrl: MenuController,
              private modalController: ModalController,
              private userServ: UsuarioService,
              private navCtrl: NavController,
              private loadingController: LoadingController,
              private alert: AlertService) { 

    this.formLogin = this.fBuilder.group({
      'usuario': ['', Validators.compose([
        Validators.required
      ])],
      'senha': ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  // Dismiss Login Modal
  dismissLogin() {
    this.modalController.dismiss();
  }  

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }
  
  async login(){
    const loading = await this.loadingController.create({
      message: 'Realizando Login...',
    });   

    await loading.present();

    this.userServ.validaUsuario(this.formLogin.value['usuario'],this.formLogin.value['senha']).subscribe(data => {
      if (data != null) {
        this.dismissLogin();
        loading.dismiss();
        this.navCtrl.navigateRoot('/home');  
      } else {
        this.alert.presentErrorToast('Usuário ou Senha incorreto!');          
        loading.dismiss();
      }
    }, error => {      
      loading.dismiss();
      this.alert.presentErrorToast('Erro ao tentar realizar o login, tente novamente mais tarde!');      
    })
    
  }

}
