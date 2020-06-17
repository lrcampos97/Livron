export interface Generos {

    LIVRO_GENERO_ID?: number;
    DESCRICAO: string;
}

export class Generos {
    constructor(values: Object = {}){
        Object.assign(this,values);
    }
}