import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../DatosClientes';
import { Cliente, Compra } from '../InterfazCliente';
import { ChangeDetectorRef } from '@angular/core';
import { BarraNavegacion } from '../../barra-navegacion/barra-navegacion';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './DetalleCliente.component.html',
  imports: [ RouterLink, BarraNavegacion],
  styleUrls: ['./DetalleCliente.component.scss']
})
export class DetalleClienteComponente implements OnInit {
  cliente: Cliente | null = null;
  compras: Compra[] = [];
  expandedPurchases: Set<string> = new Set();
  cargando: boolean = true;
  cargaCompras: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.cargarClientesDatos(clientId);
    }

  }

  cargarClientesDatos(clientId: string): void {
    this.cargando = true;
    this.cargaCompras = true;

    this.adminService.obtenerCliente(clientId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar al cliente:', error);
        this.cargando = false;
      }
    });

    this.adminService.obtenerComprasCliente(clientId).subscribe({
      next: (compras) => {
        this.compras = compras;
        this.cargaCompras = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar compras de cliente:', error);
        this.cargaCompras = false;
      }
    });
  }

  // alternar la expansión de detalles de compra
  togglePurchaseDetails(purchaseId: string): void {
    if (this.expandedPurchases.has(purchaseId)) {
      this.expandedPurchases.delete(purchaseId);
    } else {
      this.expandedPurchases.add(purchaseId);
    }
  }

  //verificar si una compra está expandida
  isDetalleCompraExpandido(purchaseId: string): boolean {
    return this.expandedPurchases.has(purchaseId);
  }

  //formatear fechas
  formatDate(date: string | Date): string {
    if (!date) return '';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  //formatear moneda
  formatCurrency(amount: number): string {
    if (amount === null || amount === undefined) return '$0.00';

    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  // obtener la etiqueta del estatus del cliente
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      '1': 'Activo',
      '0': 'Inactivo',
      'activo': 'Activo',
      'inactivo': 'Inactivo'
    };
    return statusMap[status.toLowerCase()] || 'Desconocido';
  }

  // 0btener la etiqueta del estatus de compra
  getPurchaseStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      '1': 'Completada',
      '0': 'Pendiente',
      '2': 'Cancelada',
      'completada': 'Completada',
      'pendiente': 'Pendiente',
      'cancelada': 'Cancelada'
    };
    return statusMap[status.toLowerCase()] || 'Desconocido';
  }

  goBack(): void {
    this.router.navigate(['/admin/clientes']);
  }

  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/']);
  }

}
