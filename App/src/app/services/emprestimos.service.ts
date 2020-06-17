import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UsuarioLivros } from '../models/UsuarioLivros.interface';
import { Emprestimos } from '../models/Emprestimos.interface';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class EmprestimosService {

  constructor(private http: HttpClient,  private userService: UsuarioService) { }

  addEmprestimo(emprestimo: Emprestimos): Observable<Emprestimos>{
    console.log(JSON.stringify(emprestimo));
    return this.http.post(environment.URL.emprestimo, JSON.stringify(emprestimo)).pipe(
      map((response: Emprestimos) => {        
        return response;
      })
    )
  }

  updateEmprestimo(emprestimo: Emprestimos): Observable<Emprestimos>{    
    return this.http.put(environment.URL.emprestimo + '/' + emprestimo.EMPRESTIMO_ID, JSON.stringify(emprestimo)).pipe(
      map((response: Emprestimos) => {        
        return response;
      })
    )
  }    

  getEmprestimoProprietario(): Observable<any[]>{    
    return this.http.get(environment.URL.emprestimoProprietario  + this.userService.usuarioLogadoId).pipe(
      map((response: any[]) => {        
        return response;
      })
    )
  }

  getEmprestimoResponsvel(): Observable<any[]>{    
    return this.http.get(environment.URL.emprestimoResponsavel + this.userService.usuarioLogadoId).pipe(
      map((response: any[]) => {        
        return response;
      })
    )
  }  

  getEmprestimo(emprestimoId: Number): Observable<Emprestimos>{  
    return this.http.get(environment.URL.getEmprestimo + emprestimoId ).pipe(
      map((livro: any) => {       
        return livro.map((livro) => new Emprestimos(livro));        
      })
    )
  } 

}
