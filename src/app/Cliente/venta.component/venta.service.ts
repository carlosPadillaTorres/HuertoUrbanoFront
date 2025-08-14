import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GestorSesion } from '../../ServiciosGlobales/GestorSesion';
import { environment } from '../../../enviroments/enviroment';
import Swal from 'sweetalert2';
import { VentaConDetallesDto } from '../../DTO/VentaConDetalleDto';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  url = environment.backUrl + 'Ventas/';
    constructor(private http: HttpClient) {
 }

  obtenerCompradosPorUsuario(): Observable<VentaConDetallesDto[]> {
    const encabezados = new HttpHeaders({
      'Authorization': `Bearer ${GestorSesion.getToken()}`
    });
      return this.http.get<VentaConDetallesDto[]>(`${this.url}obtenerVentasCliente`,{
        headers: encabezados
      });
    }




  async registrarCompra(ventaDto: any): Promise<any> {
    const token = GestorSesion.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post(this.url + "registrarVenta", ventaDto, { headers })
      .subscribe({
        next: (res: any) => {
          Swal.fire('Success', 'Compra realizada correctamente', 'success');
          console.log('Venta registrada correctamente', res);
          localStorage.removeItem('carrito'); // Limpiar el carrito después de la compra
          return true;
        },
        error: (err) => {
          console.error('Error al registrar la venta', err);
          if (err.error && err.error.message) {
            Swal.fire('Error', err.error.message, 'error');
          } else {
            Swal.fire('Error', 'Ocurrió un error al registrar la venta. Intente de nuevo.', 'error');
          }
          return false;
        }
      });
  }

}
