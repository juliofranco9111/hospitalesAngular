import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { BusquedasService } from './../../../services/busquedas.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Medico } from './../../../models/medico.model';

import { MedicoService } from './../../../services/medico.service';
import { ModalImagenService } from './../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[];
  public cargando = true;

  private imgSubs: Subscription;

  constructor(
    private mS: MedicoService,
    private modalS: ModalImagenService,
    private bS: BusquedasService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }



  ngOnInit(): void {

    this.cargarMedicos();

    this.imgSubs = this.modalS.nuevaImagen.pipe(delay(300))
                            .subscribe(img => this.cargarMedicos());
      
  }

  cargarMedicos() {
    // console.log('hola');
    this.cargando = true;
    this.mS.cargarMedicos()
    .subscribe(medicos => {
      this.cargando = false;
      this.medicos = medicos;
      // console.log(medicos)
    })
      
    
  }

  abrirModal(medico: Medico) {

    this.modalS.abrirModal('medicos', medico._id, medico.img);
    
    
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    // console.log(termino);
    this.bS.buscar('medicos', termino)
      .subscribe(resultados => {
         // console.log(resultados)
         this.medicos = resultados;
      });
  }

  borrarMedico(medico: Medico) {
    // console.log(medico);

   Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.mS.borrarMedico( medico._id )
          .subscribe(resp => {
            this.cargarMedicos();
            Swal.fire(
              'Medico borrado',
              `${medico.nombre} fue eliminado correctamente`,
              'success'
            );

          });

      }
    })
  }


}
