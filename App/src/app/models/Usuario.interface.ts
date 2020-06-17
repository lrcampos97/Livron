export interface Usuario {
    USUARIO_ID?: number;
    NOME: string;
    LOGIN: string;
    SENHA: string;
    EMAIL: string;
    TELEFONE: string;
    SEXO: string;
    PERFIL_ID: number;
    XP: number;
    AVATAR: String;
    POSICAO_RANKING: number;
}



export class Usuario {

    constructor(values: Object = {}){
        Object.assign(this,values);
    };
}