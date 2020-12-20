import { tap } from 'rxjs/operators';
import { UsuarioService } from './../services/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private uS: UsuarioService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
      console.log('canActivate!!!');
      return this.uS.validarToken().pipe(
        tap( estaAutenticado => {
          if (!estaAutenticado){
            this.router.navigateByUrl('login')
          }
        } )
      );


  }

}
