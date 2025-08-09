import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NgbCarouselModule
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

  constructor(private router: Router) {}

  goToLogin() {
    console.log('Se hizo clic en el botón Iniciar Sesión.');
    this.router.navigate(['/login']).then(success => {
      console.log('Navegación al login exitosa:', success);
    });
  }
}
