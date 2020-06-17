import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, Platform, AlertController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Livro } from '../../models/Livro.interface';
import { LivroService } from '../../services/livro.service';
import { UsuarioLivros } from '../../models/UsuarioLivros.interface';

import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenerosService } from 'src/app/services/generos.service';
import { Generos } from 'src/app/models/Generos.interface';

// Imaggem
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ParamDataService } from 'src/app/services/param-data.service';
import { Observable } from 'rxjs';
import { UsuarioLivrosService } from 'src/app/services/usuario-livros.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertService } from 'src/app/services/alert.service';
import { UsuarioConquistasService } from 'src/app/services/usuario-conquistas.service';


const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-novo-livro',
  templateUrl: './novo-livro.page.html',
  styleUrls: ['./novo-livro.page.scss'],
})
export class NovoLivroPage implements OnInit {

  public generos: Generos[] = [];
  public formLivro: FormGroup;
  images = [];

  base64Image: string;

  livro: Livro = {
    TITULO: '',
    SUBTITULO: '',
    PAGINAS: 0,
    ISBN: '',
    ANO: 0,
    EDICAO: '',
    EDITORA: '',
    GENERO_ID: 1,
    RESUMO: '',
    USUARIO_RESPONSAVEL_ID: 7,
    USUARIO_PROPRIETARIO_ID: null,
    AUTOR: '',
    IMAGEM: null,
    IMAGEM_DESCRICAO: '',
    STATUS: ''
  };

  constructor(private activatedRoute: ActivatedRoute,
    private providerDB: LivroService,

    private router: Router,
    private fBuilder: FormBuilder,
    private generosServ: GenerosService,
    private loadingController: LoadingController,
    public barcodeCtrl: BarcodeScanner,
    private paramData: ParamDataService,
    private userLivrosServ: UsuarioLivrosService,
    private userServ: UsuarioService,
    private alertServ: AlertService,
    private livroServ: LivroService,
    private userConquista: UsuarioConquistasService,
    public alertController: AlertController
  ) {

    this.activatedRoute.params.subscribe(parametros => {
      if (parametros['id'] > 0) { // from Livro edit
        this.providerDB.getLivro(parametros['id']).subscribe((teste: any) => {
          this.livro = teste[0];

          this.userLivrosServ.getStatusLeituraLivro(this.livro.LIVRO_ID, this.userServ.usuarioLogadoId).subscribe((statusLeitura: any) => {                      
            this.formLivro = this.fBuilder.group({
              'titulo': [this.livro.TITULO, Validators.compose([
                Validators.required
              ])],
              'subtitulo': [this.livro.SUBTITULO, Validators.compose([
                Validators.maxLength(100)
              ])],
              'ISBN': [this.livro.ISBN, Validators.compose([
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(13)
              ])],
              'editora': [this.livro.EDITORA, Validators.compose([
                Validators.required
              ])],
              'autor': [this.livro.AUTOR, Validators.compose([
                Validators.required
              ])],
              'ano': [this.livro.ANO, Validators.compose([
                Validators.required
              ])],
              'resumo': [this.livro.RESUMO, Validators.compose([
                Validators.required,
                Validators.minLength(15)
              ])],
              'paginas': [this.livro.PAGINAS, Validators.compose([
                Validators.required
              ])],
              'genero': [this.livro.GENERO_ID, Validators.compose([
                Validators.required
              ])],
              'status': [statusLeitura[0].STATUS_LEITURA, Validators.compose([
                Validators.required
              ])]
            })    
          });        
        });
      } else if ( parametros['id'] == -1){ // from Barcode
        this.goToBarcodeScan();
      } else if ( parametros['id'] == -2 ) { // from search book        
        let livroObjeto = this.paramData.getDataLastId();

        console.log(livroObjeto);
        this.formLivro = this.fBuilder.group({
          'titulo': [livroObjeto.TITULO, Validators.compose([
            Validators.required
          ])],
          'subtitulo': [livroObjeto.SUBTITULO, Validators.compose([
            Validators.maxLength(100)
          ])],
          'ISBN': [livroObjeto.ISBN, Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(13)
          ])],
          'editora': [livroObjeto.EDITORA, Validators.compose([
            Validators.required
          ])],
          'autor': [livroObjeto.AUTOR, Validators.compose([
            Validators.required
          ])],
          'ano': [livroObjeto.ANO, Validators.compose([
            Validators.required
          ])],
          'resumo': [livroObjeto.RESUMO, Validators.compose([
            Validators.required,
            Validators.minLength(15)
          ])],
          'paginas': [livroObjeto.PAGINAS, Validators.compose([
            Validators.required
          ])],
          'genero': [null, Validators.compose([
            Validators.required
          ])],
          'status': [null, Validators.compose([
            Validators.required
          ])]
        })

        this.livro.IMAGEM_DESCRICAO = livroObjeto.IMAGE;
      }
    });

    this.carregarGeneros();

    // Inicializar formgroup
    this.formLivro = this.fBuilder.group({
      'titulo': ['', Validators.compose([
        Validators.required
      ])],
      'subtitulo': ['', Validators.compose([
        Validators.maxLength(100)
      ])],
      'ISBN': [null, Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(13)
      ])],
      'editora': ['', Validators.compose([
        Validators.required
      ])],
      'autor': ['', Validators.compose([
        Validators.required
      ])],
      'ano': [null, Validators.compose([
        Validators.required
      ])],
      'resumo': ['', Validators.compose([
        Validators.required,
        Validators.minLength(15)
      ])],
      'paginas': [null, Validators.compose([
        Validators.required
      ])],
      'genero': [null, Validators.compose([
        Validators.required
      ])],
      'status': [null, Validators.compose([
        Validators.required
      ])]
    })
  }

  async goToBarcodeScan(){
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'QR_CODE,EAN',
      orientation: 'portrait',
    };

    const loading = await this.loadingController.create({
      message: 'Consultando o código ISBN...',
    });   

    this.barcodeCtrl.scan(options).then(async barcodeData => {
            
        if (barcodeData.text != '') {
          
   
                
          await loading.present();

          this.providerDB.getLivroByISBN(barcodeData.text).subscribe(data => {

            if( data.totalItems > 0 ){         
              
              data.items.forEach(element => {
                this.formLivro = this.fBuilder.group({
                  'titulo': [element.volumeInfo.title, Validators.compose([
                    Validators.required
                  ])],
                  'subtitulo': [element.volumeInfo.subtitle, Validators.compose([
                    
                  ])],
                  'ISBN': [element.volumeInfo.industryIdentifiers[0].identifier, Validators.compose([
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(13)
                  ])],
                  'editora': [element.volumeInfo.publisher, Validators.compose([
                    Validators.required
                  ])],
                  'autor': [element.volumeInfo.authors[0], Validators.compose([
                    Validators.required
                  ])],
                  'ano': [element.volumeInfo.publishedDate, Validators.compose([
                    Validators.required
                  ])],
                  'resumo': [element.volumeInfo.description, Validators.compose([
                    Validators.required,
                    Validators.minLength(15)
                  ])],
                  'paginas': [element.volumeInfo.pageCount, Validators.compose([
                    Validators.required
                  ])],
                  'genero': [null, Validators.compose([
                    Validators.required
                  ])],
                  'status': [null, Validators.compose([
                    Validators.required
                  ])]
                });     
                               
                

                if (element.volumeInfo.imageLinks == undefined){
                  this.livro.IMAGEM_DESCRICAO = 'assets/img/book-64.png';                  
                  console.log('sss');
                } else {                  
                  console.log('nois');
                  this.livro.IMAGEM_DESCRICAO = element.volumeInfo.imageLinks.thumbnail;                
                }
                
                console.log('fudeu ');
              });        
                    
              loading.dismiss();
            }
            else {
              loading.dismiss();
              this.alertServ.presentErrorToast('ISBN não encontrado na base de dados, por favor pesquisa pelo título do livro');
              this.router.navigateByUrl('/estante');
          }          
          },erro => {
            loading.dismiss();
            this.alertServ.presentErrorToast('Erro ao carregar o código ISBN, por favor tente novamente');            
            this.router.navigateByUrl('/estante');
          });
        }

    }).catch(err => {
      loading.dismiss();
      this.alertServ.presentErrorToast('Erro ao tentar ler o ISBN, por favor tente novamente.');          
      this.router.navigateByUrl('/estante');

      console.log('Error', err);
    });
  }


  ngOnInit() {
  }

  carregarGeneros() {
    this.generos = [];

    this.generosServ.getGeneros().subscribe(data => {
      data.forEach(element => {
        this.generos.push(element);
      });
    });
  }

 salvarLivro() {
    
    // Atualizar objeto
    this.livro.TITULO = this.formLivro.value['titulo'];
    this.livro.SUBTITULO = this.formLivro.value['subtitulo'];
    this.livro.PAGINAS = this.formLivro.value['paginas'];
    this.livro.ISBN = this.formLivro.value['ISBN'];
    this.livro.EDITORA = this.formLivro.value['editora'];
    this.livro.AUTOR = this.formLivro.value['autor'];
    this.livro.ANO = this.formLivro.value['ano'];
    this.livro.RESUMO = this.formLivro.value['resumo'];
    this.livro.GENERO_ID = this.formLivro.value['genero'];
    this.livro.USUARIO_PROPRIETARIO_ID = this.userServ.usuarioLogadoId;

    if ((this.livro.LIVRO_ID == 0) || (this.livro.LIVRO_ID != undefined)) {
      this.providerDB.updateLivro(this.livro).subscribe(() => {
        
        let usuarioLivro: UsuarioLivros = {
          USUARIO_ID: this.userServ.usuarioLogadoId,
          LIVRO_ID: this.livro.LIVRO_ID,
          STATUS_LEITURA: this.formLivro.value['status']          
        }
        
        this.userLivrosServ.updateUsuarioLivro(usuarioLivro).subscribe(() => {
          this.alertServ.presentSuccessToast('Livro Atualizado');          
          this.router.navigateByUrl('/estante');          
        });

      }, err => {
        this.alertServ.presentErrorToast('Ocorreu um erro ao atualizar o livro.');
        console.log(err);
      })
    } else {
      this.livro.STATUS = 'D'; 
      this.providerDB.addLivro(this.livro).subscribe((data) => {
        // incluir pessoaLivro
        let usuarioLivro: UsuarioLivros = {
          USUARIO_ID: this.userServ.usuarioLogadoId,
          LIVRO_ID: data,
          STATUS_LEITURA: this.formLivro.value['status']            
        }
                
         this.userLivrosServ.addUsuarioLivro(usuarioLivro).subscribe((data) => {
          console.log(data);
         }, err => {
          console.log(err);
         });
              
        this.router.navigateByUrl('/estante');
        this.alertServ.presentSuccessToast('Livro Adicionado');
      }, err => {
        this.alertServ.presentErrorToast('Erro ao tentar adicionar o livro, tente novamente mais tarde.');
        console.log(err);
      })
    }
  }


}
