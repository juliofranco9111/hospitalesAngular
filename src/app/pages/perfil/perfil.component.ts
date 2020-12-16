import { FileUploadService } from './../../services/file-upload.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private uS: UsuarioService,
    private fU: FileUploadService
  ) {

    this.usuario = uS.usuario;
  }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });

  }

  actualizarPerfil() {
    // console.log(this.perfilForm.value);
    this.uS.actualizarPerfil(this.perfilForm.value)
      .subscribe((resp) => {
        // console.log(resp);
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'Actualizado exitosamente'
        });
      }, err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.msg
        });
      });
  }

  cambiarImagen( file: File ){
    // console.log(file);
    this.imagenSubir = file;

    if (!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };


  }

  subirImagen(){
    this.fU.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
    .then(img => {
      this.usuario.img = img;
      Swal.fire({
        icon: 'success',
        title: 'Correcto',
        text: 'Imagen actualizada'
      });
    })
    .catch( err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error'
      });
    })
    ;
  }


}
