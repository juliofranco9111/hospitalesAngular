import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MedicoService } from './../../../services/medico.service';
import { Hospital } from './../../../models/hospital.model';
import { HospitalService } from './../../../services/hospital.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public medicoForm: FormGroup;

  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(
    private fb: FormBuilder,
    private hS: HospitalService,
    private mS: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .subscribe(({ id }) => {
        // console.log(id)
        this.cargarMedico(id);
      })

    // this.mS.getMedico()

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    })

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalId => {
        // console.log(hospitalId)
        this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalId)
        // console.log(this.hospitalSeleccionado);
      });
  }

  guardarMedico() {
    // console.log(this.medicoForm.value);
    // console.log(this.medicoSeleccionado);


    if (this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.mS.actualizarMedico(data)
        .subscribe((resp:any) => {
          // console.log((resp));
          Swal.fire('Actualizado', `Médico ${
            resp.medico.nombre
            } actualizado correctamente`);
            this.router.navigateByUrl(`/dashboard/medicos`)
        } )
      
    } else {
      const { nombre } = this.medicoForm.value;
      
      this.mS.crearMedicos(this.medicoForm.value)
      .subscribe((resp: any) => {
        // console.log(resp)
        Swal.fire('Creado', `Médico ${nombre} creado correctamente`);
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
      })
    }
  }

  cargarHospitales() {
    this.hS.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => this.hospitales = hospitales)
  }

  cargarMedico(id: string) {

    if (id === 'nuevo') {
      return;
    }

    this.mS.getMedico(id)
      .pipe(
        delay(100)    
      )
      .subscribe(medico => {
        // console.log(medico);
        
        if (!medico) {
          this.router.navigateByUrl(`/dashboard/medicos`)
        }

        const { nombre, hospital: { _id }, } = medico;
        // console.log(nombre, _id);        
        this.medicoSeleccionado = medico;
        // console.log(this.medicoSeleccionado);
        this.medicoForm.setValue({nombre, hospital: _id})
      });

  }

}
