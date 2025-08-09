import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../DatosClientes';
import { Cliente } from '../InterfazCliente';
import { ChangeDetectorRef } from '@angular/core';
import { BarraNavegacion } from '../../barra-navegacion/barra-navegacion';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: 'ListaClientes.component.html',
  imports: [ RouterLink, BarraNavegacion],
  styleUrls: ['ListaClientes.component.scss']
})
export class ListaClientesComponente implements OnInit {
  cliente: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  searchTerm: string = '';
  estatusSeleccionado: number = 1;
  cargando: boolean = true;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.adminService.obtenerClientes().subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.clientesFiltrados = cliente;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        this.cargando = false;
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilter(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.clientesFiltrados = this.cliente.filter(cliente => {
      const matchesSearch = !this.searchTerm ||
        cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.estatusSeleccionado === 1 || cliente.usuario.estatus === this.estatusSeleccionado;

      return matchesSearch && matchesStatus;
    });
  }

  clienteSeleccionado(cliente: Cliente): void {
    this.router.navigate(['/admin/detalleCliente', cliente.id]);
  }

  obtenerEstatus(estatus: number): string {
    switch(estatus) {
      case 1: return 'estatus-activo';
      case 0: return 'estatus-inactivo';
      default: return 'status-inactivo';
    }
  }

  getStatusLabel(estatus: number): string {
    switch(estatus) {
      case 1: return 'Activo';
      case 0: return 'Inactivo';
      default: return 'Inactivo';
    }
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/']);
  }

}
