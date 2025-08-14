import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../enviroments/enviroment';
import { GestorSesion } from '../../ServiciosGlobales/GestorSesion';

@Component({
  selector: 'app-barra-navegacion',
  imports: [RouterLink],
  templateUrl: './barra-navegacion.html',
  styleUrl: './barra-navegacion.css'
})
export class BarraNavegacion {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  llamarCerrarSesion(){
    if (this.isBrowser) {
      GestorSesion.confirmarCerrarSesion(this.http, this.router);
    } else {
      console.warn('Cerrar sesión solo está disponible en el navegador.');
    }
  }

  obtenerNombreUsuario(): string {
    if (this.isBrowser) {
      const tokenData = GestorSesion.getDatosToken();
      return tokenData ? tokenData.nombreUsuario : '';
    }
    return 'DESCONOCIDO';
  }

}

