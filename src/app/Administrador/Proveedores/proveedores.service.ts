import { Injectable } from '@angular/core';
import { Proveedores } from './proveedores';
import { Proveedor } from '../../Models/ProveedorModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ProveedoresService {
  url = "http://localhost:5269/Proveedor/";
  constructor() {
  }


  async getProveedores(): Promise<Proveedor[]>{
    const data = await fetch(`${this.url}obtenerProveedores`);
    const rawText = await data.text();

    try {
      const json = JSON.parse(rawText);
      return json ?? [];
    } catch (e) {
      console.error('No se pudo convertir a JSON:', e);
      return [];
    }
    /*const data = await fetch(`${this.url}obtenerProveedores`);
    console.log('DATA: ',data.body);
    return await data.json() ?? [];
    //return this.http.get<Proveedor>(`${this.url}obtenerProveedores`)*/
  }

  async getProveedoresPorId(id : Number): Promise<Proveedor | undefined> {
    const data = await fetch(`${this.url}obtenerProveedor=?${id}`);
    return await data.json() ?? [];
  }


  // Método para registrar un proveedor
  async registrarProveedor(proveedor: RegistrarProveedorRequest): Promise<any> {
    try {
      const response = await fetch(`${this.url}registrarProveedor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Agregar aquí headers adicionales como Authorization si es necesario
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
  async actualizarProveedor(proveedor: Proveedor): Promise<any> {
    try {
      const response = await fetch(`${this.url}actualizarProveedor`, {
        method: 'PUT', // o PATCH dependiendo de tu API
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Agregar aquí headers adicionales como Authorization si es necesario
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

  // Método alternativo usando async/await con manejo de errores más específico
  async registrarProveedorConValidacion(proveedor: RegistrarProveedorRequest): Promise<any> {
    // Validaciones básicas antes de enviar
    if (!proveedor.empresa.trim()) {
      return {
        success: false,
        message: 'El nombre de la empresa es requerido',
        errors: ['Empresa requerida']
      };
    }

    if (!proveedor.email.includes('@')) {
      return {
        success: false,
        message: 'El email no tiene un formato válido',
        errors: ['Email inválido']
      };
    }

    return await this.registrarProveedor(proveedor);
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
  idCiudad: Number;
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
