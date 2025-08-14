import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink
  ],
  providers: [],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  protected title = 'proyectoVerde';

  ngOnInit() {

  }

  ngOnDestroy() {

  }
}


export const formateoFecha = (fecha: string): Date | null => {
  try {
    const formato = "%Y-%m-%d";
    return new Date(fecha);
  } catch {
    return null;
  }
}

  export const formatStringToDateForInput = (dateString: string | null): string => {
  const date = new Date(dateString || '');
  return date.toISOString().substring(0, 10);
}
