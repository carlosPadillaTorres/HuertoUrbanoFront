import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
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
export class BarraNavegacion implements OnInit {
  private isBrowser: boolean;
  private tipoUsuario = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  obtenerRolUsuario(): string {
    this.tipoUsuario = (GestorSesion.getDatosToken()).rol;
    if (!this.tipoUsuario) {
      console.warn('No se pudo obtener tu tipo de usuario.');
      console.error('No se pudo obtener tu tipo de usuario');
      window.location.reload();
      return '';
    }
    else {
      return this.tipoUsuario.toString().trim();
    }
  }

  ngOnInit(): void {

  }

  llamarCerrarSesion() {
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

