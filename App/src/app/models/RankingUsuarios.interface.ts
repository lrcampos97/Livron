export interface RankingUsuarios {
    POSICAO: number;
    USUARIO_ID: number;
    LOGIN: string;
    XP: number;
}



export class Usuario {

    constructor(values: Object = {}){
        Object.assign(this,values);
    };
}