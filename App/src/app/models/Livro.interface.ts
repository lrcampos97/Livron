export interface Livro {

    LIVRO_ID?: number;
    TITULO: string;
    SUBTITULO: string
    PAGINAS: number;
    ISBN: string;
    ANO: number,
    EDICAO: string,
    EDITORA: string;  
    GENERO_ID: number;
    RESUMO: string;
    USUARIO_RESPONSAVEL_ID: number;
    USUARIO_PROPRIETARIO_ID: number;    
    AUTOR: string;
    IMAGEM: Blob;
    IMAGEM_DESCRICAO: string;
    STATUS: string; // D= Disponível ou I = Indisponível
}


export class Livro {

    constructor(values: Object = {}){
        Object.assign(this,values);
    };
    
}