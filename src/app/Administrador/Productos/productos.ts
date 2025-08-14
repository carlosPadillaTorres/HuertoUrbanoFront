
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BarraNavegacion } from '../barra-navegacion/barra-navegacion';
import { ConsultaProductoService } from '../../ServiciosGlobales/ConsultaProductosService';
import { Producto } from '../../Models/ProductoModel';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraNavegacion],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {

  rfcProveedor: string | null = null;
  nombreEmpresa: string | null = null;

  productosMostrados: Producto[] = [];
  mostrarActivos: boolean = true;

  isViewModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  selectedProduct: any | null = null;
  editFormProduct: any | null = null;

  isAddModalOpen: boolean = false;
  newProduct: any = {
    nombreProducto: '',
    marca: '',
    tipo: '',
    cantidadTotal: 0,
    costoUnidad: 0,
    descripcion: '',
    rfcProveedor: '',
    estatus: '1'
  };

  todosLosProductos: Producto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultaProductoService: ConsultaProductoService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.rfcProveedor = params['rfcProveedor'] || null;
      this.nombreEmpresa = params['nombreEmpresa'] || null;
      if (this.rfcProveedor) {
        this.newProduct.rfcProveedor = this.rfcProveedor;
      }
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
        console.error('Error al obtener productos reales:', err);
        this.todosLosProductos = [];
        this.productosMostrados = [];
      }
    });
  }

  filtrarProductosPorProveedor() {
    if (this.rfcProveedor) {
      this.productosMostrados = this.todosLosProductos.filter(
        producto => {
          const proveedorRFC = producto.proveedor?.rfc;
          return proveedorRFC === this.rfcProveedor && producto.estatus === this.mostrarActivos;
        }
      );
      console.log(`Productos para el proveedor con RFC: ${this.rfcProveedor} (Activos: ${this.mostrarActivos})`, this.productosMostrados);
    } else {
      this.productosMostrados = [];
      console.log('No se proporcionó RFC de proveedor en la URL.');
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
    this.newProduct = {
      nombreProducto: '',
      marca: '',
      tipo: '',
      cantidadTotal: 0,
      costoUnidad: 0,
      descripcion: '',
      rfcProveedor: this.rfcProveedor || '',
      estatus: '1'
    };
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

  closeAddModal() {
    this.isAddModalOpen = false;
    this.newProduct = {
      nombreProducto: '',
      marca: '',
      tipo: '',
      cantidadTotal: 0,
      costoUnidad: 0,
      descripcion: '',
      rfcProveedor: '',
      estatus: '1'
    };
  }

  // volver a la pagina de proveedores
  volverAProveedores() {
    this.router.navigate(['/proveedores']);
  }

    //cerrar sesion
  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/']);
  }
}
