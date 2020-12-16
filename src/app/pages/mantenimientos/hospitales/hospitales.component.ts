import { BusquedasService } from './../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import { ModalImagenService } from './../../../services/modal-imagen.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Hospital } from './../../../models/hospital.model';
import { HospitalService } from './../../../services/hospital.service';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription


  constructor(
    private hS: HospitalService,
    private modalS: ModalImagenService,
    private bS: BusquedasService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalS.nuevaImagen.pipe(delay(300))
                            .subscribe(img => this.cargarHospitales());
    
  }

  cargarHospitales() {
    this.hS.cargarHospitales()
      .subscribe(hospitales => {
        //console.log(hospitales)
        this.cargando = false;
        this.hospitales = hospitales;
      })
  }

  guardarCambios(hospital: Hospital) {
    // console.log(hospital);
    this.hS.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire('Actualizado', hospital.nombre, 'success')
      } )
  }

  eliminarHospital(hospital: Hospital) {
    // console.log(hospital);
    this.hS.borrarHospital(hospital._id)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success')
      } )
  }

  async abrirSwal() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Nuevo hospital',
      input: 'text',
      inputLabel: 'Ingrese un nombre',
      showCancelButton: true,
      inputPlaceholder: ''
    })
    // console.log(value);
    if (value.trim().length > 0) {
      this.hS.crearHospital(value)
        .subscribe((resp: any) => {
          // console.log(resp);
          this.hospitales.push( resp.hospital )
          // this.cargarHospitales(); 
        })
    }
  }

  abrirModal(hospital: Hospital) {

    this.modalS.abrirModal('hospitales', hospital._id, hospital.img);
    
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.cargarHospitales();
    }

    // console.log(termino);
    this.bS.buscar('hospitales', termino)
      .subscribe(resultados => {
         // console.log(resultados)
         this.hospitales = resultados;
      });

  }

}
