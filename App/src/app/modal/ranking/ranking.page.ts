import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { RankingUsuarios } from 'src/app/models/RankingUsuarios.interface';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {

  public ranking: any[] = [];
  public buscando: boolean = false;

  public usuarioPrimeiro: string;
  public usuarioPrimeiroXP: number;
  public usuarioSegundo: string;
  public usuarioSegundoXP: number;
  public usuarioTerceiro: string;
  public usuarioTerceiroXP: number;
  
  
  constructor( 
              private menu: MenuController,
              private userServ: UsuarioService, 
              public alertController: AlertController) {
                this.menu.enable(false);
              }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.buscando = true;    
    this.userServ.getRankingUsuarios().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        switch (index) {
          case 0:           
            this.usuarioPrimeiro = data[index].LOGIN;           
            this.usuarioPrimeiroXP = data[index].XP;           
            console.log(this.usuarioPrimeiro);
            break;
          case 1:
            this.usuarioSegundo = data[index].LOGIN;
            this.usuarioSegundoXP = data[index].XP;
            break;
          case 2:
            this.usuarioTerceiro = data[index].LOGIN;
            this.usuarioTerceiroXP = data[index].XP;
            break;
          default:
            this.ranking.push(data[index]);
            break;
        }
      }; 

      this.buscando = false;
    })
  }

}
