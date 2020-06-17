export interface UsuarioAmigos {
    USUARIO_AMIGO_ID: number;
    USUARIO_ID: number,
    NOME: string,
    AVATAR: string
}

export class UsuarioAmigos {

    constructor(values: Object = {}){
        Object.assign(this,values);
    };
    
}