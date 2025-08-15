
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BarraNavegacion } from '../barra-navegacion/barra-navegacion';
import { ConsultaProductoService } from '../../ServiciosGlobales/ConsultaProductosService';
import { Producto } from '../../Models/ProductoModel';
import { CompraProductoService } from '../compra-producto/compra-producto-service';
import Swal from 'sweetalert2';
import { Footer } from "../../footer/footer";


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraNavegacion, Footer],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {

   isCompraModalOpen: boolean = false;
  detallesCompra: { [productoId: number]: { cantidad: number, precioUnitario: number, nombreProducto: string } } = {};
  fechaCompra: string = new Date().toISOString().substring(0, 16);


  idProveedor: string | null = null;
  nombreEmpresa: string | null = null;

  productosMostrados: Producto[] = [];
  mostrarActivos: boolean = true;

  isViewModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  selectedProduct: any | null = null;
  editFormProduct: any | null = null;

  isAddModalOpen: boolean = false;
  newProduct: Producto = {
    idProducto: 0,
    idProveedor: 0,
    nombreProducto: '',
    marca: '',
    tipo: '',
    cantidadTotal: 0,
    descripcion: '',
    costoUnidad: 0,
    proveedor: undefined,
    estatus: true
  };

  todosLosProductos: Producto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultaProductoService: ConsultaProductoService,
    private compraProductoService: CompraProductoService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idProveedor = params['idProveedor'] || null;
      this.nombreEmpresa = params['nombreEmpresa'] || null;
      this.cargarProductos();
    });
  }

  cargarProductos() {
    this.consultaProductoService.obtenerProductos().subscribe({
      next: (productos: Producto[]) => {
        this.todosLosProductos = productos;
        this.filtrarProductosPorProveedor();
      },
      error: (err) => {
        console.error('Error al obtener productos :', err);
        this.todosLosProductos = [];
        this.productosMostrados = [];
      }
    });
  }

  filtrarProductosPorProveedor() {
    if (this.idProveedor) {
      this.productosMostrados = this.todosLosProductos.filter(
        producto => String(producto.idProveedor) === String(this.idProveedor) && producto.estatus === this.mostrarActivos
      );
      console.log(`Productos para el proveedor con id: ${this.idProveedor} (Activos: ${this.mostrarActivos})`, this.productosMostrados);
    } else {
      this.productosMostrados = [];
      console.log('No se proporcionó idProveedor en la URL.');
    }
  }

  toggleMostrarActivos() {
    this.mostrarActivos = !this.mostrarActivos;
    this.filtrarProductosPorProveedor();
  }

  getTipoNombre(tipoCode: string): string {
    switch (tipoCode) {
      case 'KIT': return 'KIT COMPLETO';
      case 'ACT': return 'ACTUADOR';
      case 'SEN': return 'SENSOR';
      case 'OTR': return 'OTRO';
      case 'PLA': return 'PLACA';
      default: return tipoCode;
    }
  }

  verProducto(producto: any) {
    this.selectedProduct = producto;
    this.isViewModalOpen = true;
  }

  closeViewModal() {
    this.isViewModalOpen = false;
    this.selectedProduct = null;
  }

  editarProducto(producto: any) {
    this.editFormProduct = { ...producto };
    this.isEditModalOpen = true;
  }

  saveEditedProduct(form: NgForm) {
    if (form.valid && this.editFormProduct && this.editFormProduct.idProducto !== undefined) {
      const index = this.todosLosProductos.findIndex(p => p.idProducto === this.editFormProduct.idProducto);
      if (index !== -1) {
        this.todosLosProductos[index] = { ...this.editFormProduct, estatus: this.todosLosProductos[index].estatus };
        console.log('Producto actualizado:', this.todosLosProductos[index]);
        this.filtrarProductosPorProveedor();
        this.closeEditModal();
      } else {
        console.error('Error: No se encontró el producto original para actualizar.');
      }
    } else {
      console.log('Formulario de edición inválido. Revise los campos.');
    }
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editFormProduct = null;
  }

  eliminarProducto(producto: any) {
    const index = this.todosLosProductos.findIndex(p => p.idProducto === producto.idProducto);
    if (index !== -1) {
      this.todosLosProductos[index].estatus = false;
      console.log('Producto marcado como eliminado (inactivo):', this.todosLosProductos[index]);
      this.filtrarProductosPorProveedor();

      if (this.isViewModalOpen && this.selectedProduct?.idProducto === producto.idProducto) {
        this.closeViewModal();
      }
      if (this.isEditModalOpen && this.editFormProduct?.idProducto === producto.idProducto) {
        this.closeEditModal();
      }
    } else {
      console.error('Producto no encontrado para eliminar (marcar como inactivo).');
    }
  }

  activarProducto(producto: any) {
    const index = this.todosLosProductos.findIndex(p => p.idProducto === producto.idProducto);
    if (index !== -1) {
      this.todosLosProductos[index].estatus = true;
      console.log('Producto activado:', this.todosLosProductos[index]);
      this.filtrarProductosPorProveedor();
    } else {
      console.error('Producto no encontrado para activar.');
    }
  }

  openAddModal() {
    this.isAddModalOpen = true;
    this.inicializarFormulario();
  }

  saveNewProduct(form: NgForm) {
    if (form.valid) {
      const newId = Math.max(...this.todosLosProductos.map(p => p.idProducto || 0)) + 1;
      const productToAdd = { ...this.newProduct, idProducto: newId };

      this.todosLosProductos.push(productToAdd);
      this.filtrarProductosPorProveedor();
      this.closeAddModal();
      console.log('Producto agregado:', productToAdd);
    } else {
      console.log('Formulario de agregar producto inválido. Revise los campos.');
    }
  }

inicializarFormulario(){
  this.newProduct = {
      idProducto: 0,
      idProveedor: 0,
      nombreProducto: '',
      marca: '',
      tipo: '',
      cantidadTotal: 0,
      descripcion: '',
      costoUnidad: 0,
      proveedor: undefined,
      estatus: true
    };
}

  closeAddModal() {
    this.isAddModalOpen = false;
    this.inicializarFormulario();
  }

  // volver a la pagina de proveedores
  volverAProveedores() {
    this.router.navigate(['/proveedores']);
  }




entero(v: string): any{
  return parseInt(v);
}

  agregarACompra(producto: Producto) {
    if (!this.detallesCompra[producto.idProducto]) {
      this.detallesCompra[producto.idProducto] = {
        cantidad: 1,
        precioUnitario: producto.costoUnidad,
        nombreProducto: producto.nombreProducto
      };
    } else {
      this.detallesCompra[producto.idProducto].cantidad += 1;
    }
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado',
      text: `${producto.nombreProducto} agregado a la lista de compra.`
    });
  }

  abrirCompraModal() {
    this.isCompraModalOpen = true;
  }

  cerrarCompraModal() {
    this.isCompraModalOpen = false;
  }

  eliminarDeCompra(productoId: number) {
    delete this.detallesCompra[productoId];
  }

  registrarCompra(form: NgForm) {
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
        text: "Agrega al menos un producto con cantidad mayor a 0."
      });
      return;
    }

    const compra = {
      proveedorId: this.idProveedor ? Number(this.idProveedor) : 0,
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
        this.detallesCompra = {};
        this.cerrarCompraModal();
      },
      error: () => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo registrar la compra."
        });
      }
    });
  }
}



