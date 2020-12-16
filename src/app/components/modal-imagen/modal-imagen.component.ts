import { FileUploadService } from './../../services/file-upload.service';
import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from './../../services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;
 
  constructor(public modalS: ModalImagenService,
  public fU:FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalS.cerrarModal();
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

  subirImagen() {
    
    const id = this.modalS.id;
    const tipo = this.modalS.tipo;

    this.fU.actualizarFoto( this.imagenSubir, tipo, id )
    .then(img => {
      Swal.fire({
        icon: 'success',
        title: 'Correcto',
        text: 'Imagen actualizada'
      });
      this.modalS.nuevaImagen.emit(img);
      this.cerrarModal();
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
