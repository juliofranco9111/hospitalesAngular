import { tap } from 'rxjs/operators';
import { UsuarioService } from './../services/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private uS: UsuarioService,
    private router: Router
  ) { }
  
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.uS.validarToken().pipe(
      tap( estaAutenticado => {
        if (!estaAutenticado){
          this.router.navigateByUrl('login')
        }
      } )
    );
  }

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
