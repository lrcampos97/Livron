import { Livro } from './Livro.interface';
import { LivroService } from '../services/livro.service';

export interface UsuarioLivro {
    USUARIO_LIVRO_ID?: number,
    USUARIO_ID: number,
    LIVRO_ID: number,
    STATUS_LEITURA: number
}

export class UsuarioLivros {    
    constructor(values: Object = {}){
        Object.assign(this,values);        
    }
}
