import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BarraNavegacion } from '../barra-navegacion/barra-navegacion';
import { Estado } from '../../Models/EstadoModel';
import { Ciudad } from '../../Models/CiudadModel';
import { EstadoService } from '../../ServiciosGlobales/EstadoService';
import { CiudadService } from '../../ServiciosGlobales/CiudadService';
import { Empleado } from '../../Models/EmpleadoModel';
import { EmpleadoService } from './empleados.service';
import { CreateEmpleadoDto } from '../../DTO/EmpleadoDto';
import Swal from 'sweetalert2';
import { formateoFecha } from '../../app';
import { Footer } from '../../footer/footer';



@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, BarraNavegacion, Footer],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})
export class EmpleadosComponent implements OnInit {

  // Listas y datos
  todosLosEmpleados: Empleado[] = [];
  empleadosMostrados: any[] = [];
  estados: Estado[] = [];
  ciudades: Ciudad[] = [];
  ciudadesFiltradas: Ciudad[] = [];

  // Control de modales
  isRegisterModalOpen = false;

  // Formulario único para crear / editar
  empleadoActual: CreateEmpleadoDto = this.initEmpleado();
  editMode = 0; // 0: Crear, 1: Editar, 2: Ver
  estadoSeleccionado: number | null = null;
  mostrarActivos: boolean = true; // Mostrar solo empleados activos por defecto

  constructor(
    private estadoService: EstadoService = inject(EstadoService),
    private ciudadService: CiudadService = inject(CiudadService),
    private empleadoService: EmpleadoService = inject(EmpleadoService),
  ) { }

  formateoFecha(emps: any[]): any[any] {
    emps.forEach(emp => {
      if (emp.persona && emp.persona.fechaNacimiento) {
        emp.persona.fechaNacimiento = emp.persona.fechaNacimiento.split('T')[0];
        emp.fechaRenuncia = emp.fechaRenuncia ? emp.fechaRenuncia.split('T')[0] : null;
        emp.fechaIngreso = emp.fechaIngreso ? emp.fechaIngreso.split('T')[0] : null;
      }
    });
    return emps
  }

  // Carga inicial de datos (por alguna razón, funciona solo si se declara antes de ngOnInit)
  cargarEmpleados(): void {
    this.empleadoService.getEmpleados().subscribe({
      next: (resultado) => {
        this.todosLosEmpleados = resultado ?? [];
        this.todosLosEmpleados = this.formateoFecha(this.todosLosEmpleados);
        this.empleadosMostrados = this.todosLosEmpleados;
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron cargar los empleados: ' + error, 'error');
        console.error("Error cargando empleados:", error);
      }
    });
  }


  ngOnInit(): void {
    this.cargarEmpleados();
    this.cargarEstados();
    this.cargarCiudades();
  }

  private initEmpleado(): CreateEmpleadoDto {
    return {
      idEmpleado: 0,
      puesto: '',
      curp: '',
      rfc: '',
      salarioBruto: 0,
      fechaIngreso: new Date(),
      persona: {
        apPaterno: '',
        apMaterno: '',
        nombre: '',
        fechaNacimiento: new Date(),
        email: '',
        telefono: '',
        genero: '',
        idDomicilio: 0,
        domicilio: {
          idDomicilio: 0,
          calle: '',
          numero: 0,
          colonia: '',
          codigoPostal: '',
          idCiudad: 0,
          ciudad: {
            idCiudad: 0,
            nombreCiudad: '',
            estado: {
              idEstado: 0,
              nombreEstado: ''
            }
          }
        }
      },
      usuario: {
        idUsuario: 0,
        nombreUsuario: '',
        contrasenia: '',
        estatus: true,
        rol: ''
      }
    };
  }



  cargarEstados(): void {
    this.estadoService.getEstados().then(estados => this.estados = estados);
  }

  cargarCiudades(): void {
    this.ciudadService.getCiudades().then(ciudades => this.ciudades = ciudades);
  }

  filtrarCiudadesPorEstado(idEstado: number | null): void {
    this.ciudadesFiltradas = this.ciudades.filter(
      c => c.estado.idEstado === idEstado
    );
  }

  nuevoEmpleado(): void {
    this.abrirModalEmpleado(0);
    this.limpiarForm();
  }

  async guardarEmpleado() {
    Swal.fire({                     // Mostrar loading mientras se procesa
      title: 'Guardando empleado...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.empleadoActual.idEmpleado === 0) {
      // Registrar
      const response = await this.empleadoService.registrarEmpleado(this.empleadoActual);
      if (response.success) {
        await Swal.fire('Éxito', 'Empleado registrado correctamente.', 'success');
        this.cerrarModal();
        this.cargarEmpleados();
      } else {
        // Formulario inválido
        let htmlErrores = '<ul>';
        response.errors.forEach((err: any) => {
          if (typeof err === 'string') {
            htmlErrores += `<li>${err}</li>`;
          } else if (err.mensajes) {
            err.mensajes.forEach((m: string) => {
              htmlErrores += `<li><b>${err.campo}:</b> ${m}</li>`;
            });
          }
        });
        htmlErrores += '</ul>';

        Swal.fire({
          icon: 'error',
          title: response.message || 'Error al registrar',
          html: htmlErrores
        });
        return;
      }
    } else {
      // Actualizar
      const response = this.empleadoService.actualizarEmpleado(this.empleadoActual);
      if (!response) {
        Swal.fire('Error', 'No se pudo actualizar el empleado.', 'error');
      } else {
        this.cerrarModal();
        Swal.fire('Éxito', 'Empleado actualizado correctamente.', 'success');
        this.cargarEmpleados();
      }
    };
  }

  verEmpleado(empleado: Empleado): void {
    this.abrirModalEmpleado(2);
    this.empleadoActual = JSON.parse(JSON.stringify(empleado));
    if (empleado?.persona?.domicilio?.ciudad?.estado?.idEstado) {
      this.filtrarCiudadesPorEstado(
        empleado.persona.domicilio.ciudad.estado.idEstado
      );
    }
  }

  eliminarEmpleado(idEmpleado: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'El empleado será marcado como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const response = this.empleadoService.eliminarEmpleado(idEmpleado);
        if (!response) {
          Swal.fire('Error', 'No se pudo eliminar el empleado.', 'error');
        } else {

          Swal.fire('Eliminado', 'Empleado eliminado correctamente.', 'success');
          this.cargarEmpleados();
        };
      }
    });
  }

  reactivarEmpleado(idEmpleado: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'El empleado será marcado como activo de nuevo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        const response = this.empleadoService.reactivarEmpleado(idEmpleado);
        if (!response) {
          Swal.fire('Error', 'No se pudo reactivar el empleado.', 'error');
        } else {
          Swal.fire('Reactivado', 'Empleado reactivado correctamente.', 'success');
          this.cargarEmpleados();
        };
      }
    });
  }

  editarEmpleado(empleado: Empleado): void {
    this.abrirModalEmpleado(1);
    this.empleadoActual = JSON.parse(JSON.stringify(empleado));
  }


  // Control de modales
  abrirModalEmpleado(modeModal: number): void {
    this.isRegisterModalOpen = true;
    this.editMode = modeModal;
  }

  cerrarModal(): void {
    this.isRegisterModalOpen = false;
    this.editMode = 0;
  }

  limpiarForm(): void {
    this.empleadoActual = this.initEmpleado();
    this.estadoSeleccionado = null;
    this.ciudadesFiltradas = [];
  }

  filtrarEmpleados() {
    this.empleadosMostrados = this.todosLosEmpleados.filter(emp => {
      return this.mostrarActivos ? emp.usuario?.estatus === true : emp.usuario?.estatus === false;
    });
  }
  toggleMostrarActivos() {
    this.mostrarActivos = !this.mostrarActivos;
    this.filtrarEmpleados();
  }


}



