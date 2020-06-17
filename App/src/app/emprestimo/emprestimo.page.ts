import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EmprestimosService } from '../services/emprestimos.service';


@Component({
  selector: 'app-emprestimo',
  templateUrl: './emprestimo.page.html',
  styleUrls: ['./emprestimo.page.scss'],
})
export class EmprestimoPage implements OnInit {

  public buscando: boolean = true;
  private pegueiEmprestado: any[] = [];
  private emprestei: any[] = [];
  public tipos: any = 0;

  constructor(private emprestimoServ: EmprestimosService, 
              private menu: MenuController) {
    this.menu.enable(false);
    this.tipos = 0;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.atualizarLivros();
  }

  segmentChanged(event) {
    this.atualizarLivros();
  }

  async atualizarLivros() {
    this.buscando = true;
    if (this.tipos == 0) {

      this.pegueiEmprestado = [];

      this.emprestimoServ.getEmprestimoResponsvel().subscribe(data => {
        data.forEach(element => {
          this.pegueiEmprestado.push(element); 
        });
        this.buscando = false;
      });

    } else if (this.tipos == 1) {

      this.emprestei = [];

      this.emprestimoServ.getEmprestimoProprietario().subscribe(data => {
        data.forEach(element => {
          this.emprestei.push(element);
        });
        this.buscando = false;
      });
    }
  }

}
