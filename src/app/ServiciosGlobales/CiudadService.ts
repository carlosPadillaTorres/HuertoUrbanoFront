import { Injectable } from '@angular/core';
import { Ciudad } from '../Models/CiudadModel';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
 url = "http://localhost:5269/";
  constructor() {
  }

async getCiudades(): Promise<Ciudad[]> {
  try {
    const response = await fetch(`${this.url}obtenerCiudades`);
    const data = await response.json();
    return data ?? [];
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
    return [];
  }
}
}
