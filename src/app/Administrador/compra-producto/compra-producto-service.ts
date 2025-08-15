import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraProductoService {
  url = environment.backUrl + "Compra/";

  constructor(private http: HttpClient) {}

  registrarCompra(compra: any): Observable<any> {
    return this.http.post(`${this.url}registrarCompra`, compra);
  }
}
