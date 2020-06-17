import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators'; 
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { UsuarioAmigos } from '../models/UsuarioAmigos.interface';
import { UsuarioService } from './usuario.service';
 

@Injectable({
  providedIn: 'root'
})
export class UsuarioAmigosService {

  constructor(private http: HttpClient, private storage: Storage, private userService: UsuarioService) { }

  addUsuarioAmigo(usuarioOutroId: Number) {
    return this.http.post(environment.URL.usuarioAmigos + this.userService.usuarioLogadoId + '/' + usuarioOutroId,'').pipe(
      map((response: any) => {
        return response;
      })
    )
  }

  getUsuarioAmigo(userOutroId: Number): Observable<any> {
    return this.http.get(environment.URL.usuarioAmigos + this.userService.usuarioLogadoId + '/' + userOutroId).pipe(
      map((user: any) => {                   
        return user;
      })
    )
  }

  getUsuarioAmigos(): Observable<UsuarioAmigos[]> {
    return this.http.get(environment.URL.usuarioAmigos + this.userService.usuarioLogadoId).pipe(
      map((user: any[]) => {
        return user.map((usuarioData) => new UsuarioAmigos(usuarioData));
      })
    )
  }

  deleteUsuarioLivro(usuarioOutroId: Number){        
    return this.http.delete(environment.URL.usuarioAmigos + this.userService.usuarioLogadoId + '/' +usuarioOutroId);
  }    
}
