import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../Models/ClienteModel';
import { VentaConDetallesDto } from '../DTO/VentaConDetalleDto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  url = environment.backUrl;
  constructor(private http: HttpClient) { }


  registrarCliente(data: Cliente): Observable<any> {
    return this.http.post(this.url+"registrarCliente", data);
  }
}
