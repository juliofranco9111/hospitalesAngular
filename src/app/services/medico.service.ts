import { Medico } from './../models/medico.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    private http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  cargarMedicos() {
    const url = `${base_url}/medicos`;

    return this.http.get(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, medicos: Medico[] }) => resp.medicos)
      )
  }

  crearMedicos(medico: { nombre: string, hospital: string }) {

    const url = `${base_url}/medicos`;

    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {

    const url = `${base_url}/medicos/${medico._id}`;

    return this.http.put(url, medico, this.headers);
  }

  borrarMedico(_id: string) {

    const url = `${base_url}/medicos/${_id}`;

    return this.http.delete(url, this.headers);
  }

  getMedico(_id: string) {
    const url = `${base_url}/medicos/${_id}`;

    return this.http.get(url, this.headers)
      .pipe(
        map((resp: { ok: boolean, medico: Medico }) => resp.medico)
      )
  }
}
