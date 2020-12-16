import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  intervalSubs: Subscription;

  constructor() {
    /* let i = -1;

    const obs$ = new Observable( observer => {
      const intervalo = setInterval(() => {
        i++;
        observer.next(i);
        if ( i === 5 ){
          clearInterval( intervalo );
          observer.complete();
        }
      }, 1000);


    });

    obs$.subscribe( 
      valor => console.log(valor),
      error => console.warn('Error: ', error),
      () => console.log('Obs terminado')
      ); */


    /* this.retornaIntervalo().subscribe(
      valor => console.log(valor)
    ); */
    this.intervalSubs = this.retornaIntervalo().subscribe( console.log );
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo() {
    const intervalo$ = interval(500).pipe(
      map( valor => valor + 1 ),
      /* filter( (valor) => {
        if (valor % 2 === 0){
          return true;
        }else{
          return false;
        }
      }), */
      filter( valor => ( valor % 2 === 0 ) ? true : false ),
      // take(10),
    );

    return intervalo$;
  }


}
