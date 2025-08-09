import { Injectable } from '@angular/core';
import { Estado } from '../Models/EstadoModel';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
url = "http://localhost:5269/";
  constructor() {
  }

  async getEstados(): Promise<Estado[]>{

    const data = await fetch(`${this.url}obtenerEstados`);
    const rawText = await data.text();
    try {
      const json = JSON.parse(rawText);
      return json ?? [];

    } catch (e) {
      console.error('No se pudo convertir a JSON:', e);
      return [];
    }
  }
}
