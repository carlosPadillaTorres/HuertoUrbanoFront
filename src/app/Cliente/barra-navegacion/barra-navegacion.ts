import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-barra-navegacion-cliente',
  imports: [RouterLink],
  templateUrl: './barra-navegacion.html',
  styleUrl: './barra-navegacion.css'
})
export class BarraNavegacionCliente {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  logout() {
    Swal.fire({                     // Mostrar loading mientras se procesa
      title: 'Cerrando sesión...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.get(environment.backUrl + 'cerrarSesion').subscribe(
      (data) => {
        Swal.fire({
          icon: "success",
          title: "Hecho!",
          text: "" + data
        });
        this.router.navigate(['/']);
      },
      (error) => {
        if (error.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "La sesión ya ha expirado. Por favor, inicie sesión de nuevo."
          });
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal al intentar cerrar sesión. Intente de nuevo: " + error.statusText
        });
      }
    );
  }
}

