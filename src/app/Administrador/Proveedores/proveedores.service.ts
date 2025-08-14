import { Injectable } from '@angular/core';
import { Proveedor } from '../../Models/ProveedorModel';
import { CreateProveedorDto, UpdateProveedorDto } from '../../DTO/ProveedorDto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'any'
})
export class ProveedoresService {
  url = environment.backUrl+"Proveedor/";
  constructor(private http: HttpClient) {
  }


  /*async getProveedores(): Promise<Proveedor[]>{
    const data = await fetch(`${this.url}obtenerProveedores`);
    const rawText = await data.text();

    try {
      const json = JSON.parse(rawText);
      return json ?? [];
    } catch (e) {
      console.error('No se pudo convertir a JSON:', e);
      return [];
    }
  }*/

 getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.url}obtenerProveedores`);
  }

  async getProveedoresPorId(id : Number): Promise<Proveedor | undefined> {
    const data = await fetch(`${this.url}obtenerProveedor=?${id}`);
    return await data.json() ?? [];
  }


  // Método para registrar un proveedor
  async registrarProveedor(proveedor: CreateProveedorDto): Promise<any> {
    try {
      const response = await fetch(`${this.url}registrarProveedor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(proveedor)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Proveedor registrado exitosamente'
      };

    } catch (error) {
      console.error('Error al registrar proveedor:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }

  // Método para actualizar un proveedor
  async actualizarProveedor(proveedor: UpdateProveedorDto): Promise<any> {
    try {
       proveedor.domicilio.ciudad = null;
      const response = await fetch(`${this.url}actualizarProveedor`, {
        method: 'PUT', // o PATCH dependiendo de tu API
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(proveedor)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Proveedor actualizado exitosamente'
      };

    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }


  // Método para eliminar (lógicamente) un proveedor
  async eliminarProveedor(idProveedor: number): Promise<any> {
    try {
      const response = await fetch(`${this.url}eliminarProveedor?id=${idProveedor}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Proveedor eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }


  // Método para activar un proveedor
  async reactivarProveedor(idProveedor: number): Promise<any> {
    try {
      const response = await fetch(`${this.url}reactivarProveedor?id=${idProveedor}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Proveedor eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }


}

// Interfaces para los tipos de datos
interface EstadoDto {
  idEstado: number;
  nombreEstado: string;
}

interface CiudadDto {
  idCiudad: number;
  nombreCiudad: string;
  idEstado: number;
  estado: EstadoDto;
}

interface DomicilioDto {
  idDomicilio: number;
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  idCiudad: number;
  ciudad: CiudadDto;
}

// Interface para registrar proveedor
export interface RegistrarProveedorRequest {
  empresa: string;
  telefono: string;
  email: string;
  rfc: string;
  estatus: boolean;
  domicilio: DomicilioDto;
}

// Interface para actualizar proveedor
interface ActualizarProveedorRequest {
  idProveedor: number;
  empresa: string;
  fechaRegistro: string; // ISO string
  fechaTermino: string; // ISO string
  estatus: boolean;
  telefono: string;
  email: string;
  rfc: string;
  idDomicilio: number;
  domicilio: DomicilioDto;
}
