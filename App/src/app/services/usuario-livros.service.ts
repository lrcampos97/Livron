import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UsuarioLivros } from '../models/UsuarioLivros.interface';
import { Livro } from '../models/Livro.interface';
import { environment } from 'src/environments/environment';
import { LivroService } from './livro.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioLivrosService {

  constructor(private http: HttpClient, private livroServ: LivroService) { }


  getUsuarioLivros(userId: number): Observable<Livro[]> {
    return this.http.get(environment.URL.getLivrosByUser + userId).pipe(
      map((data: any[]) => {       
        return data.map((livro) =>  new Livro(livro));        
      })
    )    
  } 

  getUsuarioLivrosLidos(userId: number): Observable<Livro[]> {
    return this.http.get(environment.URL.getLivrosLidosByUser + userId).pipe(
      map((data: any[]) => {       
        return data.map((livro) =>  new Livro(livro));        
      })
    )    
  }   

  getUsuarioLivrosNaoLidos(userId: number): Observable<Livro[]> {
    return this.http.get(environment.URL.getLivrosNaoLidosByUser + userId).pipe(
      map((data: any[]) => {       
        return data.map((livro) =>  new Livro(livro));        
      })
    )    
  } 


  addUsuarioLivro(usuarioLivro: UsuarioLivros): Observable<UsuarioLivros>{
    return this.http.post(environment.URL.usuarioLivros, JSON.stringify(usuarioLivro)).pipe(
      map((response: UsuarioLivros) => {        
        return response;
      })
    )
  }

  
  deleteUsuarioLivro(livroId, usuarioId: Number){        
    return this.http.delete(environment.URL.usuarioLivros + '/' +livroId + '/'+usuarioId);
  }   

  updateUsuarioLivro(usuarioLivro: UsuarioLivros): Observable<UsuarioLivros>{    
    return this.http.put(environment.URL.usuarioLivros, JSON.stringify(usuarioLivro)).pipe(
      map((response: Livro) => {        
        return response;
      })
    )
  }  
  
  getStatusLeituraLivro(livroId, usuarioId: Number): Observable<UsuarioLivros> {
    return this.http.get(environment.URL.getLivrosByLivro + livroId + '/' + usuarioId).pipe(
      map((data: any) => {       
        return data.map((livro) =>  new UsuarioLivros(livro));        
      })
    )    
  } 
 
  
}
