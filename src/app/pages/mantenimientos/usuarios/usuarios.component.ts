import { Component, OnInit, OnDestroy } from '@angular/core';

import { BusquedasService } from './../../../services/busquedas.service';
import { ModalImagenService } from './../../../services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from 'src/app/models/usuario.model';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde = 0;

  public imgSubs: Subscription;

  public cargando = true;

  constructor(
    private uS: UsuarioService,
    private bS: BusquedasService,
    private modalS: ModalImagenService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarUsuarios();

    this.imgSubs = this.modalS.nuevaImagen.pipe(delay(300))
                            .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.uS.cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {

    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp
    }

    // console.log(termino);
    this.bS.buscar('usuarios', termino)
      .subscribe((resp: Usuario[]) => {
        // console.log(resultados)
        this.usuarios = resp;
      });

  }

  eliminarUsuario(usuario: Usuario) {
    // console.log(usuario);

    if (usuario.uid === this.uS.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error')
    }


    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.uS.eliminarUsuario(usuario)
          .subscribe(resp => {
            Swal.fire(
              'Usuario borrado',
              `${usuario.nombre} fue eliminado correctamente`,
              'success'
            );

            this.cargarUsuarios();
          });

      }
    })
  }

  cambiarRole(usuario: Usuario) {
    // console.log(usuario);
    this.uS.guardarUsuario(usuario)
      .subscribe(resp => {
        console.log(resp);
      })
  }

  abrirModal(usuario: Usuario) {
    this.modalS.abrirModal('usuarios', usuario.uid, usuario.img);
    // console.log(usuario);
  }

}

