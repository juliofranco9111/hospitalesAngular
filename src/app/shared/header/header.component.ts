import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent  {

  public usuario: Usuario;

  constructor(
    private uS: UsuarioService,
    private router: Router
  ) {
    this.usuario = uS.usuario;
    // console.log(this.usuario);
  }


  logout(){
    this.uS.logout();
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      return;
    }
    this.router.navigateByUrl(`dashboard/buscar/${termino}`);
  }




}
