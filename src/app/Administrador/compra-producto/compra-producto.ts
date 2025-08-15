import { Component, OnInit } from '@angular/core';
import { Footer } from "../../footer/footer";
import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";
import { ConsultaProductoService } from '../../ServiciosGlobales/ConsultaProductosService';
import { CompraProductoService } from './compra-producto-service';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-compra-producto',
  standalone: true,
  imports: [Footer, BarraNavegacion, FormsModule],
  templateUrl: './compra-producto.html',
  styleUrl: './compra-producto.css',
  providers: [ConsultaProductoService, CompraProductoService]
})
export class CompraProducto implements OnInit {
  ngForm = '';
  productosDisponibles: any[] = [];
  detallesCompra: { [productoId: number]: { cantidad: number, precioUnitario: number } } = {};
  proveedorId: number = 1; // Cambia esto según tu lógica para obtener el proveedor
  fechaCompra: string = new Date().toISOString().substring(0, 16); // formato para input datetime-local

  constructor(
    private consultaProductoService: ConsultaProductoService,
    private compraProductoService: CompraProductoService
  ) { }

  ngOnInit() {
    this.consultaProductoService.obtenerProductos().subscribe(productos => {
      // Filtra productos del proveedor si es necesario
      this.productosDisponibles = productos.filter(p => p.idProveedor === this.proveedorId);
      // Inicializa detallesCompra
      this.productosDisponibles.forEach(p => {
        this.detallesCompra[p.idProducto] = { cantidad: 0, precioUnitario: p.costoUnidad };
      });
    });
  }

  registrarCompra(form: NgForm) {
    if (!form.valid) return;

    const detalles = Object.entries(this.detallesCompra)
      .filter(([_, d]) => d.cantidad > 0)
      .map(([productoId, d]) => ({
        productoId: Number(productoId),
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      }));

    if (detalles.length === 0) {
      Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debes agregar al menos un producto con cantidad mayor a 0.\n"
          });

      return;
    }

    const compra = {
      proveedorId: this.proveedorId,
      fechaCompra: new Date(this.fechaCompra).toISOString(),
      detalles
    };

    this.compraProductoService.registrarCompra(compra).subscribe({
      next: () => {
        Swal.fire({
            icon: "success",
            title: "Hecho",
            text: "¡Compra registrada exitosamente!"
          });
        // Limpia el formulario
        this.productosDisponibles.forEach(p => {
          this.detallesCompra[p.idProducto] = { cantidad: 0, precioUnitario: p.costoUnidad };
        });
      },
      error: (err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal al registrar la compra. Intente de nuevo.\n"+err.mensaje
          });
      }
    });
  }
}
