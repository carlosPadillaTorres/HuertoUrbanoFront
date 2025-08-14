import { Component, inject } from '@angular/core';
import { BarraNavegacionCliente } from "../barra-navegacion/barra-navegacion";
import { Footer } from "../../footer/footer";
import { VentaService } from './venta.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-venta.component',
  imports: [BarraNavegacionCliente, Footer],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {
  productos: any[] = [];
  productosComprados: any[] = [];

  mostrarModalComprados = false;
  mostrarModalConfirmacion: boolean = false;


  constructor(
    private ventaService: VentaService = inject(VentaService)
  ) { }

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    if (typeof window !== 'undefined' && localStorage) { // Verifica que localStorage esté disponible (solo ejecuta en el navegador)
      this.productos = JSON.parse(localStorage.getItem('carrito') || '[]');
    } else {
      this.productos = [];
    }
  }


  eliminarArticulo(idProducto: number): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'El empleado será marcado como inactivo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.productos = this.productos.filter(item => item.idProducto !== idProducto);
        localStorage.setItem('carrito', JSON.stringify(this.productos));
      }
    });
  }

  abrirModalComprados(): void {
    this.ventaService.obtenerCompradosPorUsuario() // ID de usuario simulado
      .subscribe({
        next: (data) => {
          this.productosComprados = data;
          this.mostrarModalComprados = true;
        },
        error: (error) => {
          Swal.fire('Error', "Algo salió mal. Intente inicar sesión de nuevo", 'error');

          console.error("Error cargando compras de cliente:", error);
        }
      });
  }

  cerrarModalComprados(): void {
    this.mostrarModalComprados = false;
  }

  confirmarCompra(): void {
    this.mostrarModalConfirmacion = true;
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;
  }

  obtenerTotal(): number {
    return this.productos.reduce((total, producto) => total + (producto.costoUnidad * producto.cantidad), 0);
  }


  registrarVenta() {
    // 1️⃣ Obtener información del localStorage
    const ventaLocal = localStorage.getItem('carrito');
    if (!ventaLocal) {
      console.error('No hay información de venta en localStorage');
      Swal.fire('Error', 'No hay productos en el carrito para registrar la venta.', 'error');
      return;
    }

    const productosLocal = JSON.parse(ventaLocal);

    // 2️⃣ Construir el DTO esperado
    const ventaDto = {
      total: 0,
      productos: [] as { idProducto: number, cantidad: number, precioUnitario: number }[]
    };

    productosLocal.forEach((p: any) => {
      ventaDto.productos.push({
        idProducto: p.idProducto,
        cantidad: p.cantidad,
        precioUnitario: p.costoUnidad
      });

      // Sumar al total
      ventaDto.total += p.cantidad * p.costoUnidad;
    });

    this.ventaService.registrarCompra(ventaDto)
    this.cerrarModalComprados();
  }
}
