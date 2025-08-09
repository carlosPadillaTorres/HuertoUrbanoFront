import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BarraNavegacion } from '../barra-navegacion/barra-navegacion';
import { Estado } from '../../Models/EstadoModel';
import { Ciudad } from '../../Models/CiudadModel';
import { EstadoService } from '../../ServiciosGlobales/EstadoService';
import { CiudadService } from '../../ServiciosGlobales/CiudadService';

// Definición de interfaces
export interface Domicilio {
  idDomicilio: number;
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  idCiudad: number;
}


export interface Persona {
  idPersona: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  idDomicilio: number;
  domicilio?: Domicilio;
}

export interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  contrasenia: string;
  estatus: number; // 1 para activo, 0 para inactivo
  idRol: string;
}

export interface Empleado {
  idEmpleado: number;
  puesto: string;
  curp: string;
  rfc: string;
  salarioBruto: number;
  fechaIngreso: string;
  fechaRenuncia?: string; // RE-AÑADIDO: Propiedad fechaRenuncia para el modal de "Ver" y lógica de estado.
  idPersona: number;
  idUsuario: number;
  persona?: Persona; // Propiedades anidadas
  usuario?: Usuario; // Propiedades anidadas
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, BarraNavegacion],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})
export class EmpleadosComponent implements OnInit {
estadosData: Estado[] = [
  ];
ciudadesData: Ciudad[] = [
   // { idCiudad: 101, ciudad: 'Guadalajara', idEstado: 1 },
   // { idCiudad: 102, ciudad: 'Zapopan', idEstado: 1 },
  //  { idCiudad: 201, ciudad: 'Miguel Hidalgo', idEstado: 2 },
  //  { idCiudad: 202, ciudad: 'Cuauhtémoc', idEstado: 2 },
  //  { idCiudad: 401, ciudad: 'León', idEstado: 4 },
  //  { idCiudad: 402, ciudad: 'Guanajuato', estado.idEstado: 4 }
  ];
   servicioEstado: EstadoService = inject(EstadoService);
  servicioCiudad: CiudadService = inject(CiudadService);

  constructor(private router: Router) {
    this.newEmpleado = this.initializeNewEmpleado();
    this.servicioEstado.getEstados().then((listaEstados: Estado[]) => {
      this.estados = listaEstados;
    });
    this.servicioCiudad.getCiudades().then((listaCiudades: Ciudad[]) => {
      this.ciudadesData = listaCiudades;
    });
  }

  // --- DATOS SIMULADOS (TU BASE DE DATOS LOCAL) ---



  domiciliosData: Domicilio[] = [
    { idDomicilio: 1, calle: 'Av. Siempre Viva', numero: '123', colonia: 'Centro', codigoPostal: '44100', idCiudad: 101 },
    { idDomicilio: 2, calle: 'Calle Falsa', numero: '45', colonia: 'Providencia', codigoPostal: '44630', idCiudad: 101 },
    { idDomicilio: 3, calle: 'Paseo de la Reforma', numero: '10', colonia: 'Juárez', codigoPostal: '06600', idCiudad: 201 },
    { idDomicilio: 4, calle: 'Manuel J. Clouthier', numero: '789', colonia: 'La Estancia', codigoPostal: '45030', idCiudad: 101 },
    { idDomicilio: 5, calle: 'Sierra Nevada', numero: '321', colonia: 'Independencia', codigoPostal: '64000', idCiudad: 301 }, // Domicilio de NL, ajustar si es necesario o eliminar
    { idDomicilio: 6, calle: 'Blvd. Aeropuerto', numero: '100', colonia: 'Los Sauces', codigoPostal: '37290', idCiudad: 401 }
  ];

  personasData: Persona[] = [
    { idPersona: 1, nombre: 'Juan', apellidoPaterno: 'García', apellidoMaterno: 'López', genero: 'H', telefono: '3312345678', email: 'juan.garcia@example.com', fechaNacimiento: '1985-05-10', idDomicilio: 1 },
    { idPersona: 2, nombre: 'Ana', apellidoPaterno: 'Martínez', apellidoMaterno: 'Pérez', genero: 'M', telefono: '4779876543', email: 'ana.martinez@example.com', fechaNacimiento: '1990-11-22', idDomicilio: 2 },
    { idPersona: 3, nombre: 'Pedro', apellidoPaterno: 'Sánchez', apellidoMaterno: 'Ramírez', genero: 'H', telefono: '5511223344', email: 'pedro.sanchez@example.com', fechaNacimiento: '1980-01-01', idDomicilio: 3 },
    { idPersona: 4, nombre: 'María', apellidoPaterno: 'Fernández', apellidoMaterno: 'Ruiz', genero: 'M', telefono: '8111223344', email: 'maria.fernandez@example.com', fechaNacimiento: '1995-07-15', idDomicilio: 4 },
    { idPersona: 5, nombre: 'Carlos', apellidoPaterno: 'Hernández', apellidoMaterno: 'Díaz', genero: 'H', telefono: '3355667788', email: 'carlos.hernandez@example.com', fechaNacimiento: '1988-03-20', idDomicilio: 5 },
    { idPersona: 6, nombre: 'Laura', apellidoPaterno: 'Díaz', apellidoMaterno: 'Vega', genero: 'M', telefono: '4771122334', email: 'laura.diaz@example.com', fechaNacimiento: '1992-09-05', idDomicilio: 6 }
  ];

  usuariosData: Usuario[] = [
    { idUsuario: 1, nombreUsuario: 'jgarcia', contrasenia: 'pass123', estatus: 1, idRol: 'ADMS' },
    { idUsuario: 2, nombreUsuario: 'amartinez', contrasenia: 'pass123', estatus: 1, idRol: 'EMPL' },
    { idUsuario: 3, nombreUsuario: 'psanchez', contrasenia: 'pass123', estatus: 0, idRol: 'EMPL' }, // Inactivo
    { idUsuario: 4, nombreUsuario: 'mfernandez', contrasenia: 'pass123', estatus: 1, idRol: 'ADMS' },
    { idUsuario: 5, nombreUsuario: 'chernandez', contrasenia: 'pass123', estatus: 1, idRol: 'EMPL' },
    { idUsuario: 6, nombreUsuario: 'ldiaz', contrasenia: 'pass123', estatus: 1, idRol: 'EMPL' }
  ];

  todosLosEmpleados: Empleado[] = [];
  empleadosMostrados: Empleado[] = [];

  // >>> SOLO VARIABLES RELACIONADAS CON AGREGAR MODAL <<<
  newEmpleado: Empleado;
  showAddModal: boolean = false; // Asegúrate de que esté inicializado en false
  estados: Estado[] = [];
  ciudadesFiltradas: Ciudad[] = [];
  selectedEstadoId: number | undefined;
  // <<< FIN DE VARIABLES RELACIONADAS CON AGREGAR MODAL >>>

  // >>> VARIABLES RELACIONADAS CON EL MODAL DE "VER" <<<
  selectedEmpleado: Empleado | null = null; // Se reutiliza para el modal de edición
  showViewModal: boolean = false;
  // <<< FIN DE VARIABLES RELACIONADAS CON EL MODAL DE "VER" <<<

  // Variables para controlar la visibilidad de inactivos
  mostrarInactivos: boolean = false;

  // >>> INICIO: Nuevas variables para el modal de edición <<<
  showeditModal: boolean = false; // Variable para controlar la visibilidad del modal de edición
  selectedEstadoIdEdit: Number | undefined; // Para el select de estado en el modal de edición
  ciudadesFiltradasEdit: Ciudad[] = []; // Para las ciudades filtradas en el modal de edición
  // >>> FIN: Nuevas variables para el modal de edición <<<



  ngOnInit(): void {
    this.buildEmpleadosData();
    this.estados = this.estadosData; // Carga los estados para los selects
    this.filtrarEmpleados(); // Filtra para mostrar solo activos al inicio por defecto
  }

  // --- MÉTODOS DE AYUDA PARA OBTENER DATOS RELACIONADOS POR ID ---
  getPersonaById(id: number): Persona | undefined {
    const persona = this.personasData.find(p => p.idPersona === id);
    if (persona) {
      // Asegurar que domicilio exista al asignar, incluso si no se encuentra
      persona.domicilio = this.getDomicilioById(persona.idDomicilio) || {
        idDomicilio: 0, calle: '', numero: '', colonia: '', codigoPostal: '', idCiudad: 0
      };
    }
    return persona;
  }

  getUsuarioById(id: number): Usuario | undefined {
    return this.usuariosData.find(u => u.idUsuario === id);
  }

  getDomicilioById(id: number): Domicilio | undefined {
    return this.domiciliosData.find(d => d.idDomicilio === id);
  }

  getCiudadById(id: number): Ciudad | undefined {
    return this.ciudadesData.find(c => c.idCiudad === id);
  }

  getEstadoById(id: number): Estado | undefined {
    return this.estadosData.find(e => e.idEstado === id);
  }

  // --- CONSTRUCCIÓN DE DATOS COMPLETOS DE EMPLEADOS ---
  private buildEmpleadosData(): void {
    const baseEmpleados: Empleado[] = [
      { idEmpleado: 1, puesto: 'Gerente', curp: 'GARC850510HDFRCA01', rfc: 'GARCJ850510ABC', salarioBruto: 30000, fechaIngreso: '2010-03-01', idPersona: 1, idUsuario: 1, fechaRenuncia: undefined },
      { idEmpleado: 2, puesto: 'Vendedor', curp: 'MART901122MJLSRN02', rfc: 'MARTN901122DEF', salarioBruto: 15000, fechaIngreso: '2018-07-15', idPersona: 2, idUsuario: 2, fechaRenuncia: undefined },
      { idEmpleado: 3, puesto: 'Soporte Técnico', curp: 'SANC800101HDFRGN03', rfc: 'SANCP800101GHI', salarioBruto: 18000, fechaIngreso: '2020-01-20', fechaRenuncia: '2023-06-30', idPersona: 3, idUsuario: 3 },
      { idEmpleado: 4, puesto: 'Contador', curp: 'FERN950715MJLSRN04', rfc: 'FERNM950715JKL', salarioBruto: 22000, fechaIngreso: '2015-09-01', idPersona: 4, idUsuario: 4, fechaRenuncia: undefined },
      { idEmpleado: 5, puesto: 'Desarrollador', curp: 'HERN880320HJSMRN05', rfc: 'HERNC880320MNO', salarioBruto: 28000, fechaIngreso: '2021-01-10', idPersona: 5, idUsuario: 5, fechaRenuncia: undefined },
      { idEmpleado: 6, puesto: 'Diseñador', curp: 'DIAZ920905MCLSRN06', rfc: 'DIAZL920905PQR', salarioBruto: 20000, fechaIngreso: '2019-04-25', idPersona: 6, idUsuario: 6, fechaRenuncia: undefined },
    ];

    this.todosLosEmpleados = baseEmpleados.map(empBase => {
      const persona = this.getPersonaById(empBase.idPersona);
      const usuario = this.getUsuarioById(empBase.idUsuario);

      return {
        ...empBase,
        persona: persona || {
          idPersona: 0, nombre: '', apellidoPaterno: '', apellidoMaterno: '', genero: 'O',
          telefono: '', email: '', fechaNacimiento: '', idDomicilio: 0,
          domicilio: { idDomicilio: 0, calle: '', numero: '', colonia: '', codigoPostal: '', idCiudad: 0 }
        },
        usuario: usuario || {
          idUsuario: 0, nombreUsuario: '', contrasenia: '', estatus: 0, idRol: ''
        }
      } as Empleado;
    });
  }

  // --- MÉTODOS DE FILTRADO Y CONTROL DE VISTA ---
  filtrarEmpleados(): void {
    if (this.mostrarInactivos) {
      this.empleadosMostrados = this.todosLosEmpleados.filter(
          emp => emp.fechaRenuncia || emp.usuario?.estatus === 0 // RE-AÑADIDO: Lógica de fechaRenuncia para filtrar inactivos
      );
    } else {
      this.empleadosMostrados = this.todosLosEmpleados.filter(
        emp => !emp.fechaRenuncia && emp.usuario?.estatus === 1 // RE-AÑADIDO: Lógica de fechaRenuncia para filtrar activos
      );
    }
  }

  toggleMostrarInactivos(): void {
    this.mostrarInactivos = !this.mostrarInactivos;
    this.filtrarEmpleados();
  }

  // >>> MÉTODOS PARA MODAL DE "AGREGAR" <<<
  private initializeNewEmpleado(): Empleado {
    // Establece fechaIngreso a la fecha actual
    const today = new Date().toISOString().substring(0, 10);

    return {
      idEmpleado: 0, puesto: '', curp: '', rfc: '', salarioBruto: 0, fechaIngreso: today, // Usar 'today'
      idPersona: 0, idUsuario: 0,
      persona: {
        idPersona: 0, nombre: '', apellidoPaterno: '', apellidoMaterno: '', genero: 'O',
        telefono: '', email: '', fechaNacimiento: '', idDomicilio: 0,
        domicilio: { idDomicilio: 0, calle: '', numero: '', colonia: '', codigoPostal: '00000', idCiudad: 0 }
      },
      usuario: { idUsuario: 0, nombreUsuario: '', contrasenia: '', estatus: 1, idRol: 'EMPL' }
    };
  }

  openAddModal(): void {
    this.newEmpleado = this.initializeNewEmpleado();
    this.selectedEstadoId = undefined;
    this.ciudadesFiltradas = [];
    this.showAddModal = true;
    console.log('DEBUG: openAddModal ha sido llamado. showAddModal es:', this.showAddModal);
  }

  closeAddModal(): void {
    this.showAddModal = false;
    console.log('DEBUG: closeAddModal ha sido llamado. showAddModal es:', this.showAddModal);
  }

  addEmpleado(form: NgForm): void {
    if (form.valid) {
      // Asignar nuevos IDs (simulados)
      const newPersonaId = this.personasData.length > 0 ? Math.max(...this.personasData.map(p => p.idPersona)) + 1 : 1;
      const newUsuarioId = this.usuariosData.length > 0 ? Math.max(...this.usuariosData.map(u => u.idUsuario)) + 1 : 1;
      const newDomicilioId = this.domiciliosData.length > 0 ? Math.max(...this.domiciliosData.map(d => d.idDomicilio)) + 1 : 1;
      const newEmpleadoId = this.todosLosEmpleados.length > 0 ? Math.max(...this.todosLosEmpleados.map(e => e.idEmpleado)) + 1 : 1;

      // Asignar IDs al nuevo empleado y sus sub-objetos
      this.newEmpleado.persona!.idPersona = newPersonaId;
      this.newEmpleado.usuario!.idUsuario = newUsuarioId;
      this.newEmpleado.persona!.domicilio!.idDomicilio = newDomicilioId;
      this.newEmpleado.idPersona = newPersonaId;
      this.newEmpleado.idUsuario = newUsuarioId;
      this.newEmpleado.idEmpleado = newEmpleadoId;

      // Clonar y agregar a los datos simulados
      this.domiciliosData.push({...this.newEmpleado.persona!.domicilio!});
      this.personasData.push({...this.newEmpleado.persona!, domicilio: undefined});
      this.usuariosData.push({...this.newEmpleado.usuario!});

      // Reconstruir el objeto Empleado con referencias completas para todosLosEmpleados
      const fullNewEmpleado: Empleado = {
          ...this.newEmpleado,
          persona: { ...this.newEmpleado.persona!, domicilio: {...this.newEmpleado.persona!.domicilio!} },
          usuario: { ...this.newEmpleado.usuario! }
      };

      this.todosLosEmpleados.push(fullNewEmpleado);
      this.filtrarEmpleados(); // Vuelve a filtrar para actualizar la tabla
      this.closeAddModal();
    } else {
      // Mensajes o lógica para formulario inválido irán aquí
    }
  }

  // >>> INICIO: Lógica unificada para filtrar ciudades (usada por agregar y editar) <<<
  filterCitiesByState(isEditMode: boolean = false): void {
    let currentSelectedEstadoId: Number | undefined;
    let targetDomicilio: Domicilio | undefined;

    if (isEditMode) {
      currentSelectedEstadoId = this.selectedEstadoIdEdit;
      targetDomicilio = this.selectedEmpleado?.persona?.domicilio;
      if (currentSelectedEstadoId) {
        this.ciudadesFiltradasEdit = this.ciudadesData.filter(ciudad => ciudad.estado.idEstado === +currentSelectedEstadoId!);
      } else {
        this.ciudadesFiltradasEdit = [];
      }
      if (targetDomicilio) {
        const currentCityFound = this.ciudadesFiltradasEdit.find(c => c.idCiudad === targetDomicilio?.idCiudad);
        if (!currentCityFound) {
            targetDomicilio.idCiudad = 0; // Resetea si la ciudad actual no pertenece al nuevo estado
        }
      }
    } else {
      currentSelectedEstadoId = this.selectedEstadoId;
      targetDomicilio = this.newEmpleado.persona?.domicilio;
      if (currentSelectedEstadoId) {
        this.ciudadesFiltradas = this.ciudadesData.filter(ciudad => ciudad.estado.idEstado === +currentSelectedEstadoId!);
      } else {
        this.ciudadesFiltradas = [];
      }
      if (targetDomicilio) {
        const currentCityFound = this.ciudadesFiltradas.find(c => c.idCiudad === targetDomicilio?.idCiudad);
        if (!currentCityFound) {
            targetDomicilio.idCiudad = 0; // Resetea si la ciudad actual no pertenece al nuevo estado
        }
      }
    }
  }
  // >>> FIN: Lógica unificada para filtrar ciudades <<<
  // <<< FIN DE MÉTODOS PARA MODAL DE "AGREGAR" >>>

  // >>> MÉTODOS PARA MODAL DE "VER" <<<
  openViewModal(empleado: Empleado): void {
    // Asegurarse de que selectedEmpleado tenga todas las propiedades anidadas para evitar errores en el HTML
    this.selectedEmpleado = {
      ...empleado,
      persona: empleado.persona || {
        idPersona: 0, nombre: '', apellidoPaterno: '', apellidoMaterno: '', genero: 'O',
        telefono: '', email: '', fechaNacimiento: '', idDomicilio: 0,
        domicilio: { idDomicilio: 0, calle: '', numero: '', colonia: '', codigoPostal: '', idCiudad: 0 }
      },
      usuario: empleado.usuario || {
        idUsuario: 0, nombreUsuario: '', contrasenia: '', estatus: 0, idRol: ''
      }
    };
    // Formatear fechas para input type="date" en el modal de ver
    if (this.selectedEmpleado.persona && this.selectedEmpleado.persona.fechaNacimiento) {
      this.selectedEmpleado.persona.fechaNacimiento = this.formatDateForInput(this.selectedEmpleado.persona.fechaNacimiento);
    }
    if (this.selectedEmpleado.fechaIngreso) {
      this.selectedEmpleado.fechaIngreso = this.formatDateForInput(this.selectedEmpleado.fechaIngreso);
    }
    // RE-AÑADIDO: Lógica para fechaRenuncia en el modal de "Ver"
    if (this.selectedEmpleado.fechaRenuncia) {
      this.selectedEmpleado.fechaRenuncia = this.formatDateForInput(this.selectedEmpleado.fechaRenuncia);
    }

    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedEmpleado = null;
  }
  // <<< FIN DE MÉTODOS PARA MODAL DE "VER" <<<

  // >>> INICIO: Nuevos métodos para el modal de edición <<<

  /**
   * Abre el modal de edición con los datos del empleado seleccionado.
   * Realiza una copia profunda del empleado para evitar modificar los datos originales directamente.
   * Formatea las fechas para que se muestren correctamente en los inputs de tipo 'date'.
   * Preselecciona el estado y filtra las ciudades para los selects de domicilio.
   * @param empleado El objeto Empleado a editar.
   */
  openEditModal(empleado: Empleado): void {
    // Realizar una copia profunda para que los cambios no afecten la tabla directamente hasta guardar
    this.selectedEmpleado = JSON.parse(JSON.stringify(empleado));

    // Formatear fechas para input type="date"
    // Usamos '?' en 'persona?.fechaNacimiento' para una verificación segura de null/undefined
    if (this.selectedEmpleado?.persona?.fechaNacimiento) {
      this.selectedEmpleado.persona.fechaNacimiento = this.formatDateForInput(this.selectedEmpleado.persona.fechaNacimiento);
    }
    // La fecha de ingreso no se edita, pero se formatea para mostrarla correctamente si se necesitara
    // if (this.selectedEmpleado.fechaIngreso) {
    //   this.selectedEmpleado.fechaIngreso = this.formatDateForInput(this.selectedEmpleado.fechaIngreso);
    // }
    // MANTENIDO: La propiedad fechaRenuncia NO se procesa ni se muestra en el modal de edición.
    // if (this.selectedEmpleado?.fechaRenuncia) {
    //   this.selectedEmpleado.fechaRenuncia = this.formatDateForInput(this.selectedEmpleado.fechaRenuncia);
    // } else {
    //   this.selectedEmpleado.fechaRenuncia = undefined;
    // }


    // Preseleccionar estado y filtrar ciudades para el modal de edición
    // Almacenamos el domicilio del empleado en una variable local para un acceso más seguro.
    const empleadoDomicilio = this.selectedEmpleado?.persona?.domicilio;

    if (empleadoDomicilio?.idCiudad) {
      const ciudad = this.ciudadesData.find(c => c.idCiudad === empleadoDomicilio.idCiudad);
      if (ciudad) {
        this.selectedEstadoIdEdit = ciudad.estado.idEstado;
        this.filterCitiesByState(true); // Pasar true para que use ciudadesFiltradasEdit
      }
    } else {
      this.selectedEstadoIdEdit = undefined;
      this.ciudadesFiltradasEdit = [];
    }

    this.showeditModal = true; // Activar la visibilidad del modal de edición
  }

  /**
   * Cierra el modal de edición y resetea las variables relacionadas.
   */
  closeeditModal(): void {
    this.showeditModal = false;
    this.selectedEmpleado = null; // Limpiar el empleado seleccionado
    this.selectedEstadoIdEdit = undefined;
    this.ciudadesFiltradasEdit = [];
  }

  /**
   * Maneja el envío del formulario de edición para actualizar los datos del empleado.
   * @param form El formulario NgForm con los datos editados.
   */
  updateEmpleado(form: NgForm): void {
    if (form.valid && this.selectedEmpleado) {
      // Revertir formato de fechas si es necesario antes de "guardar" en los datos simulados
      if (this.selectedEmpleado.persona && this.selectedEmpleado.persona.fechaNacimiento) {
        this.selectedEmpleado.persona.fechaNacimiento = new Date(this.selectedEmpleado.persona.fechaNacimiento).toISOString().split('T')[0];
      }
      // MANTENIDO: La propiedad fechaRenuncia NO se procesa ni se guarda desde el modal de edición.
      // if (this.selectedEmpleado.fechaRenuncia) {
      //   this.selectedEmpleado.fechaRenuncia = new Date(this.selectedEmpleado.fechaRenuncia).toISOString().split('T')[0];
      // } else {
      //   this.selectedEmpleado.fechaRenuncia = undefined;
      // }

      // Lógica para actualizar los datos en los arreglos simulados
      const empleadoIndex = this.todosLosEmpleados.findIndex(e => e.idEmpleado === this.selectedEmpleado!.idEmpleado);
      if (empleadoIndex !== -1) {
        // Actualizar Persona
        const personaIndex = this.personasData.findIndex(p => p.idPersona === this.selectedEmpleado!.idPersona);
        if (personaIndex !== -1) {
          this.personasData[personaIndex].nombre = this.selectedEmpleado!.persona!.nombre;
          this.personasData[personaIndex].apellidoPaterno = this.selectedEmpleado!.persona!.apellidoPaterno;
          this.personasData[personaIndex].apellidoMaterno = this.selectedEmpleado!.persona!.apellidoMaterno;
          this.personasData[personaIndex].genero = this.selectedEmpleado!.persona!.genero;
          this.personasData[personaIndex].telefono = this.selectedEmpleado!.persona!.telefono;
          this.personasData[personaIndex].email = this.selectedEmpleado!.persona!.email;
          this.personasData[personaIndex].fechaNacimiento = this.selectedEmpleado!.persona!.fechaNacimiento;
        }

        // Actualizar Domicilio
        const domicilioIndex = this.domiciliosData.findIndex(d => d.idDomicilio === this.selectedEmpleado!.persona!.idDomicilio);
        if (domicilioIndex !== -1) {
          this.domiciliosData[domicilioIndex].calle = this.selectedEmpleado!.persona!.domicilio!.calle;
          this.domiciliosData[domicilioIndex].numero = this.selectedEmpleado!.persona!.domicilio!.numero;
          this.domiciliosData[domicilioIndex].colonia = this.selectedEmpleado!.persona!.domicilio!.colonia;
          this.domiciliosData[domicilioIndex].codigoPostal = this.selectedEmpleado!.persona!.domicilio!.codigoPostal;
          this.domiciliosData[domicilioIndex].idCiudad = this.selectedEmpleado!.persona!.domicilio!.idCiudad;
        }

        // Actualizar Usuario (contraseña solo si se proporciona)
        const usuarioIndex = this.usuariosData.findIndex(u => u.idUsuario === this.selectedEmpleado!.idUsuario);
        if (usuarioIndex !== -1) {
          this.usuariosData[usuarioIndex].nombreUsuario = this.selectedEmpleado!.usuario!.nombreUsuario;
          if (this.selectedEmpleado!.usuario!.contrasenia) { // Solo actualiza si el campo no está vacío
            this.usuariosData[usuarioIndex].contrasenia = this.selectedEmpleado!.usuario!.contrasenia;
          }
          this.usuariosData[usuarioIndex].idRol = this.selectedEmpleado!.usuario!.idRol;
          // Estatus no se edita aquí, se maneja con toggleEmpleadoStatus
        }

        // Actualizar Empleado principal
        this.todosLosEmpleados[empleadoIndex].puesto = this.selectedEmpleado!.puesto;
        // CURP y RFC no se editan, se mantienen los valores originales
        // this.todosLosEmpleados[empleadoIndex].curp = this.selectedEmpleado!.curp;
        // this.todosLosEmpleados[empleadoIndex].rfc = this.selectedEmpleado!.rfc;
        this.todosLosEmpleados[empleadoIndex].salarioBruto = this.selectedEmpleado!.salarioBruto;
        // MANTENIDO: La propiedad fechaRenuncia NO se actualiza desde el modal de edición.
        // this.todosLosEmpleados[empleadoIndex].fechaRenuncia = this.selectedEmpleado!.fechaRenuncia;

        // Vuelve a vincular las referencias actualizadas
        this.todosLosEmpleados[empleadoIndex].persona = this.getPersonaById(this.selectedEmpleado!.idPersona);
        this.todosLosEmpleados[empleadoIndex].usuario = this.getUsuarioById(this.selectedEmpleado!.idUsuario);
      }

      this.filtrarEmpleados(); // Refrescar la tabla
      this.closeeditModal();
    } else {
      console.error('Formulario de edición inválido o empleado no seleccionado.');
    }
  }

  /**
   * Función auxiliar para formatear fechas a 'YYYY-MM-DD' para inputs HTML type="date".
   * @param dateString La cadena de fecha a formatear.
   * @returns La fecha formateada como 'YYYY-MM-DD'.
   */
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Asegurarse de que la fecha sea UTC para evitar problemas de zona horaria con toISOString
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // >>> FIN: Nuevos métodos para el modal de edición <<<


  // --- MÉTODOS DE MANIPULACIÓN DE DATOS (Solo toggleStatus para este escenario) ---
  toggleEmpleadoStatus(empleado: Empleado): void {
    const usuarioToToggle = this.usuariosData.find(u => u.idUsuario === empleado.idUsuario);
    if (usuarioToToggle) {
      usuarioToToggle.estatus = usuarioToToggle.estatus === 1 ? 0 : 1;
      // RE-AÑADIDO: Lógica para fechaRenuncia en toggleEmpleadoStatus
      if (usuarioToToggle.estatus === 0) {
        empleado.fechaRenuncia = new Date().toISOString().slice(0, 10);
      } else {
        empleado.fechaRenuncia = undefined;
      }

      const empInAll = this.todosLosEmpleados.find(e => e.idEmpleado === empleado.idEmpleado);
      if (empInAll) {
          empInAll.usuario!.estatus = usuarioToToggle.estatus;
          // RE-AÑADIDO: Actualizar fechaRenuncia en el empleado principal
          empInAll.fechaRenuncia = empleado.fechaRenuncia;
      }

      this.filtrarEmpleados();
    }
  }

  // --- TrackBy para *ngFor (optimización de rendimiento) ---
  trackByIdEmpleado(index: number, empleado: Empleado): number {
    return empleado.idEmpleado;
  }

  // Método para cerrar sesión
  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/']);
  }

  clearAddFormFields(): void {
    this.newEmpleado = this.initializeNewEmpleado(); // Reinicializa el objeto newEmpleado
    this.selectedEstadoId = undefined; // Limpia el estado seleccionado
    this.ciudadesFiltradas = []; // Limpia las ciudades filtradas
    console.log('DEBUG: Campos del formulario de agregar limpiados.');
  }
}

