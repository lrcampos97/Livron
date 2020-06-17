import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators'; 
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { RankingUsuarios } from '../models/RankingUsuarios.interface';
 
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  public estaLogado: boolean = false;
  public usuarioLogadoId: number = 0;
  public usuario: Usuario;

  constructor(private http: HttpClient, private storage: Storage) { }


  addUsuario(usuario: Usuario) {
    return this.http.post(environment.URL.usuario, JSON.stringify(usuario)).pipe(
      map((response: any) => {
        return response;
      })
    )
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put(environment.URL.usuario + '/' + usuario.USUARIO_ID, JSON.stringify(usuario)).pipe(
      map((response: Usuario) => {
        return response;
      })
    )
  }

  getUsuario(usuarioId: Number): Observable<Usuario> {
    return this.http.get(environment.URL.livro + '/' + usuarioId).pipe(
      map((user: any) => {
        return user.map((usuarioData) => new Usuario(usuarioData));
      })
    )
  }

  


  validaUsuario(usuario, senha: string): Observable<Usuario> {
    return this.http.get(environment.URL.validaUsuario + '/' + usuario + '/' + senha).pipe(
      map((user: any) => {
        if (user.length != 0) {
          return user.map((usuarioData) => {
            new Usuario(usuarioData)
            this.storage.set(environment.USER_STORAGE, JSON.stringify(usuarioData))
              .then(
                () => {
                  this.usuarioLogadoId = usuarioData.USUARIO_ID;
                  this.usuario = usuarioData;
                },
                error => console.error('Error storing item', error)
              );
          });
        } else { return null };
      })
    )
  }

  logout() {

    this.usuarioLogadoId = null;
    this.usuario = null;
    this.estaLogado = false;

    this.storage.remove('PRIMEIRO_ACESSO');
    return this.storage.remove(environment.USER_STORAGE);
  }


  getUsuarioLogado() {
    return this.storage.get(environment.USER_STORAGE).then(
      data => {
        this.usuario = data;

        if (this.usuario != null) {
          this.usuarioLogadoId = data.USUARIO_ID;
          this.estaLogado = true;
        } else {
          this.estaLogado = false;
        }
      },
      error => {
        this.usuario = null;
        this.estaLogado = false;
        this.usuarioLogadoId = null;
      });
  }


  getRankingUsuarios(): Observable<RankingUsuarios[]>{
    return this.http.get(environment.URL.usuariosRanking).pipe(
      map((usuario: RankingUsuarios[]) => {       
        return usuario;        
      })
    )
  } 

 getPosicaoUsuarioRanking(userId): number{
    let achou: boolean = false; 
    this.getRankingUsuarios().subscribe(data => {
      data.forEach(element => {
        if (element.USUARIO_ID == userId && !achou) {
          achou = true;
          return element.POSICAO;          
        }
      });
    })

    return -1;
  }  


  getLivrosDisponiveis(userId): Observable<any[]>{
    return this.http.get(environment.URL.getLivrosDisponiveis + userId).pipe(
      map((usuario: any[]) => {       
        return usuario;        
      })
    )
  }    
}
