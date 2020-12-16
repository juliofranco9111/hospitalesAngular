import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent  {

  public usuario: Usuario;

  constructor(private uS: UsuarioService) {
    this.usuario = uS.usuario;
    // console.log(this.usuario);
  }


  logout(){
    this.uS.logout();
  }




}
