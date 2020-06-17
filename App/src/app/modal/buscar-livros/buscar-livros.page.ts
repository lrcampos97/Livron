import { Component, OnInit } from '@angular/core';
import { LivroService } from '../../services/livro.service';
import { ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { ParamDataService } from 'src/app/services/param-data.service';

@Component({
  selector: 'app-buscar-livros',
  templateUrl: './buscar-livros.page.html',
  styleUrls: ['./buscar-livros.page.scss'],
})
export class BuscarLivrosPage implements OnInit {

  public pesquisa: any;  
  public livros: any[] = [];
  public buscando: boolean = false;

  constructor(private LivroServ: LivroService, 
              private ModalCtrl: ModalController,
              private router: Router,
              private paramData: ParamDataService) { }

  ngOnInit() {
  }

  buscarLivros(){
    if (this.pesquisa != ''){      
      this.buscando = true;      
      this.LivroServ.getLivroByTitle(this.pesquisa).subscribe(data => {
        this.livros = [];
        try {
        
          if( data.totalItems > 0 ){   
            data.items.forEach(element => {   
              if (this.livros.indexOf(element) == -1){            
                this.livros.push({
                  TITULO: element.volumeInfo.title,
                  SUBTITULO: element.volumeInfo.subtitle,
                  ISBN:element.volumeInfo.industryIdentifiers[0].identifier,
                  EDITORA: element.volumeInfo.publisher,
                  AUTOR: element.volumeInfo.authors[0],
                  ANO: element.volumeInfo.publishedDate,
                  RESUMO: element.volumeInfo.description,
                  PAGINAS: element.volumeInfo.pageCount,
                  IMAGE: element.volumeInfo.imageLinks.thumbnail
                });  
              }   
              
            });
            console.log(this.livros);
          }  

          this.buscando = false;
        } catch (error) {
          this.buscando = false;  
        }              
      })
      
    }
  }

  enviarLivroParaCadastro(livro: any){   
    this.paramData.setData(livro)
    this.router.navigateByUrl('/novo-livro/-2');
    this.closeModal();
  }


  closeModal(){
    this.ModalCtrl.dismiss();  
  }

}
