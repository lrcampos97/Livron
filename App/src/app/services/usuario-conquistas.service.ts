import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { UsuarioConquistas } from '../models/UsuarioConquistas.interface';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioConquistasService {

  constructor(private http: HttpClient, private storage: Storage, private alert: AlertController, private userServ: UsuarioService ) { }


  addPrimeiroAcesso(usuarioId) {
    return this.http.post(environment.URL.usuarioConquistasPrimeiroAcesso + usuarioId , null).pipe(
      map((response: any) => {
        return response;
      })
    )
  }

  addConquista(usuarioId, conquistaId) {
    return this.http.put(environment.URL.usuaroiConquistasReceberConquista + usuarioId + '/' +conquistaId , null).pipe(
      map((response: any) => {
        return response;
      })
    )
  }  

  getUsuarioConquistas(usuarioId: Number): Observable<UsuarioConquistas[]> {
    return this.http.get(environment.URL.usuarioConquistas + usuarioId).pipe(
      map((user: any) => {
        return user.map((usuarioData) => new UsuarioConquistas(usuarioData));
      })
    )
  }  


  getUsuarioConquista(usuarioId, conquistaId: Number): Observable<UsuarioConquistas> {
    return this.http.get(environment.URL.usuarioConquista + usuarioId + '/' + conquistaId).pipe(
      map((conquista: any) => {
        return conquista.map((usuarioData) => new UsuarioConquistas(usuarioData));
      })
    )
  }  
}
