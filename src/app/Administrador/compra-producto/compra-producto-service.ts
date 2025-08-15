import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { GestorSesion } from '../../ServiciosGlobales/GestorSesion';

@Injectable({
  providedIn: 'root'
})
export class CompraProductoService {
  url = environment.backUrl + "Compra/";

  constructor(private http: HttpClient) {}

  registrarCompra(compra: any): Observable<any> {
    const encabezados = new HttpHeaders({
      'Authorization': `Bearer ${GestorSesion.getToken()}`,
    });
    return this.http.post(`${this.url}registrarCompra`, compra, {
      headers: encabezados
    });
  }
}
