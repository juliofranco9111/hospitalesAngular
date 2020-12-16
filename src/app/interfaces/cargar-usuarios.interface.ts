import { Usuario } from 'src/app/models/usuario.model';


export interface cargarUsuario {
    total: number;
    usuarios: Usuario[];
}