import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public usuario: Usuario;
  menuItems: any[];


  constructor(
    private sidebarService: SidebarService,
    private uS: UsuarioService
    ) {

    this.usuario = uS.usuario;

    this.menuItems = sidebarService.menu;
    // console.log(this.menuItems)
  }

  ngOnInit(): void {
  }

}
