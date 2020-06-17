import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { Generos } from '../models/Generos.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  constructor(private http: HttpClient) { }


  getGeneros(): Observable<Generos[]>{  
    return this.http.get(environment.URL.generos).pipe(
      map((Genero: any[]) => {       
        return Genero.map((genero) => new Generos(genero));        
      })
    )
  }

  getGenero(GeneroId: Number): Observable<Generos>{  
    return this.http.get(environment.URL.generos + '/' + GeneroId ).pipe(
      map((Genero: any) => {       
        return Genero.map((genero) => new Generos(genero));        
      })
    )
  }  


}
