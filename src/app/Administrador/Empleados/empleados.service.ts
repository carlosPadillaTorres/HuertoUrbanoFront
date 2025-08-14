import { environment } from './../../../enviroments/enviroment';
import { Injectable } from '@angular/core';
import { CreateEmpleadoDto } from '../../DTO/EmpleadoDto';
import { Empleado } from '../../Models/EmpleadoModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  url = environment.backUrl+"Empleado/";
  constructor(private http: HttpClient) {
  }


  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.url}obtenerEmpleados`);
  }

  async getEmpleadoPorId(id: Number): Promise<Empleado | undefined> {
    const data = await fetch(`${this.url}obtenerEmpleado=?${id}`);
    return await data.json() ?? [];
  }

  formateoEmpleadoRegistro(empleado: CreateEmpleadoDto): any {
    if (empleado.usuario) {
      (empleado.usuario.estatus) = true; // Asegura que el estatus sea booleano
      empleado.usuario.token = null; // Asegura que el token no se envíe
    }
    delete empleado.persona.domicilio.ciudad; // Evita enviar la ciudad completa

    return empleado;
  }

  // Método para registrar un proveedor
  async registrarEmpleado(empleado: CreateEmpleadoDto): Promise<any> {
    try {
      empleado = this.formateoEmpleadoRegistro(empleado);
      console.log(empleado);

      const response = await fetch(`${this.url}registrarEmpleado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(empleado)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.message || 'Error desconocido',
          errors: errorData.errors || []
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Empleado registrado exitosamente'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Error inesperado',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }

  // Método para actualizar un proveedor
  async actualizarEmpleado(empleado: CreateEmpleadoDto): Promise<any> {
    try {
      empleado.persona.domicilio.ciudad = null;
      const response = await fetch(`${this.url}actualizarEmpleado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(empleado)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'Empleado actualizado exitosamente'
      };

    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }


  // Método para eliminar (lógicamente) un proveedor
  async eliminarEmpleado(idEmpleado: number): Promise<any> {
    try {
      const response = await fetch(`${this.url}eliminarEmpleado?id=${idEmpleado}`, {
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
        message: 'Empleado eliminado exitosamente'
      };

    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }


  // Método para eliminar (lógicamente) un proveedor
  async reactivarEmpleado(idEmpleado: number): Promise<any> {
    try {
      const response = await fetch(`${this.url}reactivarEmpleado?id=${idEmpleado}`, {
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
        message: 'Empleado reactivado exitosamente'
      };

    } catch (error) {
      console.error('Error al reactivar empleado:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
        errors: [error instanceof Error ? error.message : 'Error desconocido']
      };
    }
  }


}
