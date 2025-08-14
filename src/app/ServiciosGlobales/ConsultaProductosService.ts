import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../Models/ProductoModel';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaProductoService {

 private productos: Producto[] = [
    {
      idProducto: 1,
      nombreProducto: 'Placa ESP32',
      marca: 'ESP',
      tipo: 'PLA',
      cantidadTotal: 10,
      costoUnidad: 250,
      descripcion: 'Placa de desarrollo ESP32 con WiFi y Bluetooth.',
      idProveedor: 1,
      estatus: true
    },
    {
      idProducto: 2,
      nombreProducto: 'Sensor de temperatura DHT11',
      marca: 'XYZ',
      tipo: 'SEN',
      cantidadTotal: 50,
      costoUnidad: 50,
      descripcion: 'Sensor de temperatura y humedad.',
      idProveedor: 2,
      estatus: true
    },
    {
      idProducto: 3,
      nombreProducto: 'Motor paso a paso',
      marca: 'ABC',
      tipo: 'ACT',
      cantidadTotal: 15,
      costoUnidad: 120,
      descripcion: 'Motor paso a paso de alta precisión.',
      idProveedor: 3,
      estatus: true
    },
    {
      idProducto: 4,
      nombreProducto: 'Kit de robótica',
      marca: 'RoboKit',
      tipo: 'KIT',
      cantidadTotal: 5,
      costoUnidad: 899,
      descripcion: 'Kit completo para armar robot educativo.',
      idProveedor: 4,
      estatus: true
    }
  ];

  url = environment.backUrl+"Producto/";
  constructor(private http: HttpClient) {
  }
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}obtenerProductos`);
  }
}
