import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { Usuario } from 'src/app/models/usuario.model';
import { RegisterForm } from './../interfaces/register-form.interface';
import { cargarUsuario } from './../interfaces/cargar-usuarios.interface';
import { LoginForm } from './../interfaces/login-form.interface';


const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }




  googleInit() {

    return new Promise(resolve => {

      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '953263477197-vunts3dqrot67ro0eo86dt7ldh2e0f5u.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin'
        });
      });

      resolve();
    });
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {

        console.log('User signed out.');
        this.router.navigateByUrl('/login');
      });
    });
  }

  crearUsuario(formData: RegisterForm) {
    // console.log('creando usuario');
    return this.http.post(`${base_url}/usuarios`, formData);
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers );
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        // console.log(resp);
        const {
          email,
          google,
          nombre,
          role,
          img,
          uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img || '', google, role, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false)));
  }

  login(usuario: Usuario, recordar: boolean): Observable<any> {

    if (recordar === true) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    // console.log('creando usuario');
    const url = base_url + '/login';
    return this.http.post(url, usuario)
      .pipe(tap((resp: any) => {
        // console.log(resp.usuarioDB.uid);
        localStorage.setItem('id', resp.usuarioDB.uid);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', JSON.stringify(resp.usuarioDB));

        return true;
      }));
  }

  loginGoogle(token): Observable<any> {


    // console.log('creando usuario');
    const url = base_url + '/login/google';
    return this.http.post(url, { token })
      .pipe(tap((resp: any) => {
        // console.log(resp);
        localStorage.setItem('token', resp.token);
        return true;
      }));
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;

    return this.http.get<cargarUsuario>(url, this.headers)
                .pipe(map( resp => {
                  // console.log(resp);
                  const usuarios = resp.usuarios.map( user => new Usuario(
                    user.nombre,
                    user.email,
                    '',
                    user.img,
                    user.google,
                    user.role,
                    user.uid) )
                  return {
                    total: resp.total,
                    usuarios
                  }
                } ))

  }

  eliminarUsuario( usuario: Usuario) {
    // console.log('eliminando');

    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);

  }

  guardarUsuario( usuario: Usuario ) {

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers );
  }
}
