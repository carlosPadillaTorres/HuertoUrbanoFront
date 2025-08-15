import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { Footer } from "../footer/footer";
import { GestorSesion } from '../ServiciosGlobales/GestorSesion';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NgbCarouselModule,
    Footer
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  images = [
    { src: '../assets/1.png', alt: 'Imagen 1' },
    { src: '../assets/2.png', alt: 'Imagen 2' },
    { src: '../assets/3.png', alt: 'Imagen 3' },
    { src: '../assets/4.png', alt: 'Imagen 4' },
    { src: '../assets/5.png', alt: 'Imagen 5' }
  ];

  private isBrowser: boolean;
  private tipoUsuario: '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router,
      private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.tipoUsuario='';
  }


  obtenerRolUsuario(): string {
    this.tipoUsuario = (GestorSesion.getDatosToken()).rol;

      return this.tipoUsuario;

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

  goToLogin() {
    console.log('Se hizo clic en el botón Iniciar Sesión.');
    this.router.navigate(['/login']).then(success => {
      console.log('Navegación al login exitosa:', success);
    });
  }
}
