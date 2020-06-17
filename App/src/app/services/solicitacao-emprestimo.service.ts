import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { UsuarioLivros } from '../models/UsuarioLivros.interface';
import { SolicitacaoEmprestimo } from '../models/SolicitacaoEmprestimo.interface';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoEmprestimoService {

  constructor(private http: HttpClient,  private userService: UsuarioService) { }

  solicitarEmprestimo(emprestimo: SolicitacaoEmprestimo): Observable<SolicitacaoEmprestimo>{
    return this.http.post(environment.URL.solicitarEmprestimo, JSON.stringify(emprestimo)).pipe(
      map((response: SolicitacaoEmprestimo) => {        
        return response;
      })
    )
  }
  
  solicitacaoAprovada(solicitacaoEmprestimoId: number,statusSolicitacao: boolean): Observable<any>{    
    return this.http.put(environment.URL.solicitacaoAprovada + solicitacaoEmprestimoId + '/'+statusSolicitacao, null).pipe(
      map((response: any) => {        
        return response;
      })
    )
  }  
  
  getSolicitacoesRecebidas(): Observable<any[]>{    
    return this.http.get(environment.URL.getSolicitacoesRecebidas + this.userService.usuarioLogadoId).pipe(
      map((response: any[]) => {        
        return response;
      })
    )
  }  
  
  getSolicitacoesEnviadas(): Observable<any[]>{    
    return this.http.get(environment.URL.getSolicitacoesEnviadas + this.userService.usuarioLogadoId).pipe(
      map((response: any[]) => {        
        return response;
      })
    )
  }  
  
  cancelarSolicitacaoEmprestimo(solicitacaoEmprestimoId: Number){        
    return this.http.delete(environment.URL.cancelarSolicitacaoEmprestimo  + solicitacaoEmprestimoId);
  }    

}
