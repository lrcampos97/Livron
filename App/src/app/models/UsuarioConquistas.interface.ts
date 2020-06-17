
export interface UsuarioConquistas {
    USUARIO_CONQUISTA_ID?: number,
    USUARIO_ID: number,
    DESCRICAO: string,
    XP: number,
    ATINGIU: boolean,
    CONQUISTA_ID: number
}

export class UsuarioConquistas {    
    constructor(values: Object = {}){
        Object.assign(this,values);        
    }
}
