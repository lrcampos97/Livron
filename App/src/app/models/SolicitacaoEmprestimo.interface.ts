export interface SolicitacaoEmprestimo {
    SOLICITACAO_EMPRESTIMO_ID: number;
    LIVRO_ID: number;
    PONTO_COLETA_ID: number;
    USUARIO_SOLICITANTE_ID: number;
    USUARIO_SOLICITADO_ID: number;
    APROVADO: Boolean;
    DATA_EMPRESTIMO: Date;
}



export class SolicitacaoEmprestimo {

    constructor(values: Object = {}){
        Object.assign(this,values);
    };
}