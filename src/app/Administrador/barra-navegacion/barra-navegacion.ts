import { Component, Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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

  logout() {
    this.http.get('https://localhost:7276/cerrarSesion').subscribe(
        (data) => {
          Swal.fire({
          icon: "success",
          title: "Hecho!",
          text: ""+data
        });
        this.router.navigate(['/']);
       },
       (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal al intentar cerrar sesión. Intente de nuevo."
        });
       }
     );
  }
}

