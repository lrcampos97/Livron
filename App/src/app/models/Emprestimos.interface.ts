export interface Emprestimos {

    EMPRESTIMO_ID?: number;
    LIVRO_ID: number;
    PONTO_COLETA_ID: number;
    USUARIO_RESPONSAVEL_ID: number;
    USUARIO_PROPRIETARIO_ID: number;
    DATA_EMPRESTIMO: Date;
    DATA_ENTREGA: Date;
    OBS: string; 

}

export class Emprestimos {

    constructor(values: Object = {}){
        Object.assign(this,values);
    };
    
}