import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { formateoFecha, formatStringToDateForInput } from '../../app'
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BarraNavegacion } from '../barra-navegacion/barra-navegacion';
import { Proveedor } from '../../Models/ProveedorModel';
import { ProveedoresService, RegistrarProveedorRequest } from './proveedores.service';
import { EstadoService } from '../../ServiciosGlobales/EstadoService';
import { Estado } from '../../Models/EstadoModel';
import { CiudadService } from '../../ServiciosGlobales/CiudadService';
import { Ciudad } from '../../Models/CiudadModel';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, BarraNavegacion],
  templateUrl: './proveedores.html',
  styleUrls: ['./proveedores.css']
})

export class Proveedores implements OnInit {
  todosLosProveedores: Proveedor[] = [];
  estados: Estado[] = [];
  ciudades: Ciudad[] = [];

  servicioProveedor: ProveedoresService = inject(ProveedoresService);
  servicioEstado: EstadoService = inject(EstadoService)
  servicioCiudad: CiudadService = inject(CiudadService)

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.servicioProveedor.getProveedores().then((listaProveedores: Proveedor[]) => {
      this.todosLosProveedores = listaProveedores;
      //this.filtrarProveedores();
      this.proveedoresMostrados = this.todosLosProveedores;
    });

    this.servicioEstado.getEstados().then((listaEstados: Estado[]) => {
      this.estados = listaEstados;
    });

    this.servicioCiudad.getCiudades().then((listaCiudades: Ciudad[]) => {
      this.todasLasCiudades = listaCiudades;
    });
  }

  todasLasCiudades: Ciudad[] = [];


  proveedoresMostrados: any[] = [];
  mostrarActivos: boolean = true;

  isModalOpen = false;
  isViewModalOpen = false;
  isEditModalNewOpen = false;

  selectedProveedor: any | null = null;

  selectedEstadoId: string = '';
  selectedCiudad: string = '';

  empresa: string = '';
  fechaRegistro: string = new Date().toISOString().substring(0, 10);
  fechaTermino: string = '';
  estatus: string = '1';
  telefono: string = '';
  email: string = '';
  rfc: string = '';
  calle: string = '';
  numero: string = '';
  colonia: string = '';
  codigoPostal: string = '';

  editNewForm: Proveedor = this.initEditNewFormProv()
  editNewFormCiudades: Ciudad[] = [];


  filtrarProveedores() {
    this.proveedoresMostrados = this.todosLosProveedores.filter(prov => {
      return this.mostrarActivos ? prov.estatus === true : prov.estatus === false;
      // return this.mostrarActivos ? prov.estatus === '1' : prov.estatus === '0';
    });
  }

  toggleMostrarActivos() {
    this.mostrarActivos = !this.mostrarActivos;
    this.filtrarProveedores();
  }

  // ---modal de AGREGAR ---
  openModal() {
    this.isModalOpen = true;
    this.clearForm();
  }

  closeModal() {
    this.isModalOpen = false;
    this.clearForm();
  }

  clearForm() {
    this.empresa = '';
    this.fechaRegistro = new Date().toISOString().substring(0, 10);
    this.fechaTermino = '';
    this.estatus = '1';
    this.telefono = '';
    this.email = '';
    this.rfc = '';
    this.calle = '';
    this.numero = '';
    this.colonia = '';
    this.codigoPostal = '';
    this.selectedEstadoId = '';
    this.selectedCiudad = '';
    this.ciudades = [];
  }

  // **Ciudades**
  updateCiudades() {
    const estadoIdNum = parseInt(this.selectedEstadoId);
    this.ciudades = this.todasLasCiudades.filter(c => c.estado.idEstado === estadoIdNum);
    this.selectedCiudad = '';
  }




  async saveProveedor(form: NgForm) {
    if (form.valid) {
      // Mostrar loading mientras se procesa
      Swal.fire({
        title: 'Guardando proveedor...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Crear el objeto para registrar el proveedor
        const newProveedor: RegistrarProveedorRequest = {
          empresa: this.empresa,
          email: this.email,
          telefono: this.telefono,
          rfc: this.rfc,
          estatus: this.estatus === '1',
          domicilio: {
            idDomicilio: 0,
            calle: this.calle,
            numero: this.numero.toString(), // Convertir a string según tu API
            colonia: this.colonia,
            codigoPostal: this.codigoPostal,
            idCiudad: new Number(this.selectedCiudad) || 0, // Usar la ciudad seleccionada
            ciudad: {
              idCiudad: 0,
              nombreCiudad: "",
              idEstado: 0,
              estado: {
                idEstado: 0,
                nombreEstado: ""
              }
            }
          }
        };

        // Llamar al servicio para registrar el proveedor
        const resultado = await this.servicioProveedor.registrarProveedor(newProveedor);

        if (resultado.success) {
          // Éxito - mostrar mensaje de confirmación
          await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: resultado.message || 'Proveedor registrado correctamente',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'Aceptar'
          });

          //await this.cargarProveedores(); // Método para recargar la lista desde el servidor

          this.filtrarProveedores();
          this.closeModal();
          this.clearForm();

          console.log('Proveedor agregado exitosamente:', resultado.data);

        } else {
          // Error del servidor o validación
          await Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            html: this.formatErrorMessages(resultado.errors || [resultado.message || 'Error desconocido']),
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Entendido'
          });

          console.error('Error al registrar proveedor:', resultado.message);
        }

      } catch (error) {
        // Error inesperado
        console.error('Error inesperado:', error);

        await Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Ocurrió un error al intentar registrar el proveedor. Por favor, inténtelo nuevamente.',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Aceptar'
        });
      }

    } else {
      // Formulario inválido
      await Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos correctamente.',
        confirmButtonColor: '#ffc107',
        confirmButtonText: 'Revisar'
      });

      // Marcar todos los campos como touched para mostrar errores de validación
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      console.log('Formulario inválido. Campos con errores:', this.getFormErrors(form));
    }
  }
  // Método auxiliar para obtener errores del formulario
  private getFormErrors(form: NgForm): any {
    const formErrors: any = {};

    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.controls[key].errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }
  // Método auxiliar para formatear mensajes de error
  private formatErrorMessages(errors: string[]): string {
    if (errors.length === 0) return 'Error desconocido';
    if (errors.length === 1) return errors[0];

    return `
      <ul style="text-align: left; margin: 0; padding-left: 20px;">
        ${errors.map(error => `<li>${error}</li>`).join('')}
      </ul>
    `;
  }

  // --- modal de VER ---
  verProveedor(proveedor: any) {
    this.selectedProveedor = proveedor;
    this.selectedProveedor.fechaTermino = formateoFecha(this.selectedProveedor.fechaTermino);
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedProveedor = null;
  }

  // ---modal de EDITAR ---
  openEditModalNew(proveedor: Proveedor) {
    console.log('Prov: ', proveedor);
    this.isEditModalNewOpen = true;
    this.editNewForm = { ...proveedor };
    console.log('DomicilioProv: ', this.editNewForm.domicilio);
    this.updateCiudadesForEditNew();
  }

  closeEditModalNew() {
    this.isEditModalNewOpen = false;
    this.clearEditNewForm();
  }

  initEditNewFormProv(): Proveedor {
    return {
      idProveedor: 0,
      empresa: '',
      fechaRegistro: new Date(),
      fechaTermino: new Date(),
      estatus: true,
      telefono: '',
      email: '',
      rfc: '',
      domicilio: {
        idDomicilio: 0,
        calle: '',
        numero: 0,
        codigoPostal: '',
        colonia: '',
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
    };
  }


  clearEditNewForm() {
    this.editNewForm = this.initEditNewFormProv();
    this.editNewFormCiudades = [];
  }

  // Ciudades
  updateCiudadesForEditNew() {
    const estadoIdNum = this.editNewForm.domicilio.ciudad.estado.idEstado;
    this.editNewFormCiudades = this.todasLasCiudades
      .filter(c => c.estado.idEstado === estadoIdNum);

    if (!this.editNewFormCiudades.includes(this.editNewForm.domicilio.ciudad)) {
      this.editNewForm.domicilio.ciudad.nombreCiudad = '';
    }
  }

  async saveEditedProveedorNew(form: NgForm) {
    if (form.valid) {
      // Mostrar loading mientras se procesa
      Swal.fire({
        title: 'Actualizando proveedor...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Llamar al servicio para actualizar el proveedor
        const resultado = await this.servicioProveedor.actualizarProveedor({
          ...this.editNewForm,
          fechaRegistro: this.getFechaRegistroForInput(), // string "YYYY-MM-DD"
          fechaTermino: this.editNewForm.fechaTermino
            ? formatStringToDateForInput(this.editNewForm.fechaTermino.toString())
            : '',
          domicilio: {
            ...this.editNewForm.domicilio,
            numero: new Number(this.editNewForm.domicilio.numero.toString()) // <-- asegúrate que es string
          }
        });

        if (resultado.success) {
          await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: resultado.message || 'Proveedor actualizado correctamente',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'Aceptar'
          });

          // Actualizar la lista local si es necesario
          const index = this.todosLosProveedores.findIndex(p => p.rfc === this.editNewForm.rfc);
          if (index !== -1) {
            this.todosLosProveedores[index] = { ...this.editNewForm };
            this.filtrarProveedores();
          }
          this.closeEditModalNew();
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            html: this.formatErrorMessages(resultado.errors || [resultado.message || 'Error desconocido']),
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Entendido'
          });
        }
      } catch (error) {
        console.error('Error inesperado:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Ocurrió un error al intentar actualizar el proveedor. Por favor, inténtelo nuevamente.',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      await Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, complete todos los campos requeridos correctamente.',
        confirmButtonColor: '#ffc107',
        confirmButtonText: 'Revisar'
      });

      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });

      console.log('Formulario de edición inválido. Campos con errores:', this.getFormErrors(form));
    }
  }


  // --- ir a productos ---
  goToProductosByProveedor(proveedor: any) {
    this.router.navigate(['/productos'], { queryParams: { rfcProveedor: proveedor.rfc, nombreEmpresa: proveedor.empresa } });
  }

  getEstadoName(estadoId: number): String {
    const estado = this.estados.find(e => e.idEstado === estadoId);
    return estado ? estado.nombreEstado : 'Desconocido';
  }

  // ---ELIMINAR---
  eliminarProveedor(proveedor: any) {
    const index = this.todosLosProveedores.findIndex(p => p.rfc === proveedor.rfc);
    if (index !== -1) {
      this.todosLosProveedores[index].estatus = false;
      //this.todosLosProveedores[index].estatus = '0';
      console.log('Proveedor eliminado (estatus cambiado a 0):', this.todosLosProveedores[index]);
      this.filtrarProveedores();

      if (this.isViewModalOpen && this.selectedProveedor && this.selectedProveedor.rfc === proveedor.rfc) {
        this.closeViewModal();
      }
      if (this.isEditModalNewOpen && this.editNewForm.rfc === proveedor.rfc) {
        this.closeEditModalNew();
      }
    }
  }

  // --- Activar
  activarProveedor(proveedor: any) {
    const index = this.todosLosProveedores.findIndex(p => p.rfc === proveedor.rfc);
    if (index !== -1) {
      this.todosLosProveedores[index].estatus = true;
      //this.todosLosProveedores[index].estatus = '1';
      console.log('Proveedor activado (estatus cambiado a 1):', this.todosLosProveedores[index]);
      this.filtrarProveedores();
    }
  }

  getFechaRegistroForInput(): string {
    return formatStringToDateForInput(this.editNewForm.fechaRegistro.toString());
  }

  setFechaRegistroFromInput(value: string) {
    this.editNewForm.fechaRegistro = new Date(value);
  }
}


