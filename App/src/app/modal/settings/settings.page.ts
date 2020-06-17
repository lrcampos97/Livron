import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private ModalCtrl: ModalController,
              private userService: UsuarioService,
              private router: Router,
              private menu: MenuController) { 
                this.menu.enable(true);
              }

  ngOnInit() {
  }

  logout(){
    this.userService.logout().then(() => {
      this.closeModal();
      this.router.navigateByUrl('/welcome');
    })        
  }


  closeModal(){
    this.ModalCtrl.dismiss();  
  }

}
