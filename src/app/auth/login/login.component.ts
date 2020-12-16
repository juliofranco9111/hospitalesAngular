import { UsuarioService } from './../../services/usuario.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  public auth2: any;

  public loginForm = this.fb.group({
    email: ['test1@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    remember: [false]
  });



  constructor(
    private router: Router,
    private fb: FormBuilder,
    private uS: UsuarioService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    this.renderButton();
  }


  login() {

    const remember = this.loginForm.value.remember;

    console.log( 'recordar ' + remember);

    this.uS.login(this.loginForm.value, remember)
      .subscribe(correcto => {
        // console.log(correcto);
        this.router.navigate(['/dashboard']);
      });
  }

  // const id_token = googleUser.getAuthResponse().id_token;


  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark'
    });

    this.startApp();
  }

  async startApp() {
      await this.uS.googleInit();

      this.auth2 = this.uS.auth2;

      this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        // console.log(id_token);

        this.uS.loginGoogle( id_token ).subscribe( resp => {
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        });

      }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
