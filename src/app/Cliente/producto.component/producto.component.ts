import { Component, OnInit } from '@angular/core';
import { BarraNavegacionCliente } from "../barra-navegacion/barra-navegacion";
import { Producto } from '../../Models/ProductoModel';
import { ConsultaProductoService } from '../../ServiciosGlobales/ConsultaProductosService';
import { CarritoComponent } from "../carrito.component/carrito.component";
import { Footer } from "../../footer/footer";
import Swal from 'sweetalert2';
import { BarraNavegacion } from "../../Administrador/barra-navegacion/barra-navegacion";

@Component({
  selector: 'app-producto.component',
  imports: [BarraNavegacionCliente, CarritoComponent, Footer, BarraNavegacion],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoClienteComponent implements OnInit {


  categorias = [
    { idCategoria: 1, nombre: 'Placa ESP32', tipo: 'PLA' },
    { idCategoria: 2, nombre: 'Sensores', tipo: 'SEN' },
    { idCategoria: 3, nombre: 'Actuadores', tipo: 'ACT' },
    { idCategoria: 4, nombre: 'Kits Completos', tipo: 'KIT' }
  ];

  categoriaSeleccionada: string | null = null;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  mostrarModal = false;

  constructor(private productoService: ConsultaProductoService) { }

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe(data => {
      this.productos = data;
      this.productosFiltrados = data;
    });
  }

  seleccionarCategoria(tipo: string): void {
    this.categoriaSeleccionada = tipo;
    this.productosFiltrados = this.productos.filter(p => p.tipo === tipo);
  }

  mostrarDetalle(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }


  agregarAlCarrito(producto: Producto, cantidad: number): void {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    const productoExistente = carrito.find((item: any) => item.idProducto === producto.idProducto);

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.push({
        ...producto,
        cantidad
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    Swal.fire('Éxito', 'Producto agregado al carrito.', 'success');
    this.cerrarModal();
  }

}
