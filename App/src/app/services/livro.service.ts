import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UsuarioLivros } from '../models/UsuarioLivros.interface';
import { Livro } from '../models/Livro.interface';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LivroService {


  constructor(private http: HttpClient) { }


  getLivros(): Observable<UsuarioLivros[]>{  
    return this.http.get(environment.URL.livro).pipe(
      map((livro: any[]) => {       
        return livro.map((livro) => new UsuarioLivros(livro));        
      })
    )
  }

  getLivro(LivroId: Number): Observable<Livro>{  
    return this.http.get(environment.URL.livro + '/' + LivroId ).pipe(
      map((livro: any) => {       
        return livro.map((livro) => new Livro(livro));        
      })
    )
  }  

  addLivro(Livro: Livro): Observable<Livro>{
    return this.http.post(environment.URL.livro, JSON.stringify(Livro)).pipe(
      map((response: Livro) => {        
        return response;
      })
    )
  }

  
  getLivrosByUser(proprietarioId: number): Observable<Livro[]>{
    return this.http.get(environment.URL.getLivrosByProprietario + proprietarioId).pipe(
      map((livro: any[]) => {       
        return livro.map((livro) => new Livro(livro));        
      })
    )
  }

  updateLivro(Livro: Livro): Observable<Livro>{    
    return this.http.put(environment.URL.livro + '/' + Livro.LIVRO_ID, JSON.stringify(Livro)).pipe(
      map((response: Livro) => {        
        return response;
      })
    )
  }  

  deleteLivro(LivroId: Number){        
    return this.http.delete(environment.URL.livro + '/' + LivroId);
  }    

  
  /// Buscar livros do google 
  getLivroByISBN(ISBN): Observable<any>{
   return this.http.get(environment.URL.ISBN + ISBN + environment.token_google).pipe(
      map((livro: any) => {                   
        return livro;
      }, err => {
        console.log(err);
      })     
    )
  }

  /// Buscar livros do google 
  getLivroByTitle(Title): Observable<any>{
    return this.http.get(environment.URL.TITLE + Title + environment.token_google).pipe(
       map((livro: any) => {                   
         return livro;
       }, err => {
         console.log(err);
       })     
     )
   }  


   atualizarStatusLivro(livroId: Number, status): Observable<Livro>{    
    return this.http.put(environment.URL.atualizarStatusLivro +  livroId + '/' +status, null).pipe(
      map((response: Livro) => {        
        return response;
      })
    )
  }  

   
}
