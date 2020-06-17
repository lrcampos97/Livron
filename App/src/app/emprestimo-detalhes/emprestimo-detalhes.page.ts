import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { EmprestimosService } from '../services/emprestimos.service';
import { Emprestimos } from '../models/Emprestimos.interface';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-emprestimo-detalhes',
  templateUrl: './emprestimo-detalhes.page.html',
  styleUrls: ['./emprestimo-detalhes.page.scss'],
})
export class EmprestimoDetalhesPage implements OnInit {

  emprestimo: any = {
    EMPRESTIMO_ID: 0,
    LIVRO_ID: 0,
    PONTO_COLETA_ID: 0,
    USUARIO_RESPONSAVEL_ID: 0,
    USUARIO_PROPRIETARIO_ID: 0,
    DATA_EMPRESTIMO: new Date,
    DATA_ENTREGA: new Date,
    OBS: '',
    LIVRO_TITULO: '',
    LIVRO_SUBTITULO: '',
    IMAGEM_DESCRICAO: '',
    LIVRO_AUTOR: ''
  }

  constructor(private emprestimoServ: EmprestimosService,               
              private menu: MenuController,
              private route: ActivatedRoute,
              public loadingController: LoadingController,
              public alert: AlertService) { 
                this.menu.enable(false);
              }

  ngOnInit() {
    this.route.params.subscribe(async parametros => {
      if (parametros['id']){

        const loading = await this.loadingController.create({
          message: 'Carregando Empréstimo...',
        });
        await loading.present();

        this.emprestimoServ.getEmprestimo(parametros['id']).subscribe((test: any) => {
          this.emprestimo = test[0];
          loading.dismiss();
        }, erro => {
            loading.dismiss();
            this.alert.presentErrorToast('Erro ao tentar carregar o empréstimo, tente novamente mais tarde');
            console.log(erro);
        });  
                                      
      }
    });
  }


}
