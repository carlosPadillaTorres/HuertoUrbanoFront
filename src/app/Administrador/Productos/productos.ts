
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { BarraNavegacion } from '../barra-navegacion/barra-navegacion';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BarraNavegacion],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit {

  rfcProveedor: string | null = null;
  nombreEmpresa: string | null = null;

  productosMostrados: any[] = [];
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

  todosLosProductos = [
    {
      idProducto: 1,
      nombreProducto: 'Arduino UNO R3',
      marca: 'Arduino',
      tipo: 'PLA',
      cantidadTotal: 150,
      costoUnidad: 15.99,
      descripcion: 'Placa de desarrollo Arduino UNO R3, ideal para proyectos de electrónica y robótica.',
      rfcProveedor: '1234567890AA',
      estatus: '1'
    },
    {
      idProducto: 2,
      nombreProducto: 'Sensor de Temperatura DHT11',
      marca: 'Generic',
      tipo: 'SEN',
      cantidadTotal: 300,
      costoUnidad: 5.50,
      descripcion: 'Sensor de temperatura y humedad digital, fácil de usar con microcontroladores.',
      rfcProveedor: '1234567890AA',
      estatus: '1'
    },
    {
      idProducto: 3,
      nombreProducto: 'Kit de Inicio Arduino',
      marca: 'Elegoo',
      tipo: 'KIT',
      cantidadTotal: 50,
      costoUnidad: 49.99,
      descripcion: 'Kit completo para empezar con Arduino, incluye placa, componentes y tutoriales.',
      rfcProveedor: '9876543210BB',
      estatus: '1'
    },
    {
      idProducto: 4,
      nombreProducto: 'Módulo Bluetooth HC-05',
      marca: 'Generic',
      tipo: 'OTR',
      cantidadTotal: 200,
      costoUnidad: 8.75,
      descripcion: 'Módulo Bluetooth para comunicación serial inalámbrica entre dispositivos.',
      rfcProveedor: '1234567890AA',
      estatus: '0'
    },
    {
      idProducto: 5,
      nombreProducto: 'Servomotor SG90',
      marca: 'TowerPro',
      tipo: 'ACT',
      cantidadTotal: 250,
      costoUnidad: 3.20,
      descripcion: 'Pequeño servomotor de 9g, ideal para proyectos de robótica ligera.',
      rfcProveedor: '5555555555CC',
      estatus: '1'
    },
    {
      idProducto: 6,
      nombreProducto: 'Protoboard 400 puntos',
      marca: 'Generic',
      tipo: 'OTR',
      cantidadTotal: 400,
      costoUnidad: 2.10,
      descripcion: 'Protoboard de 400 puntos para prototipado rápido de circuitos electrónicos.',
      rfcProveedor: '9876543210BB',
      estatus: '0'
    },
    {
      idProducto: 7,
      nombreProducto: 'LEDs Surtidos (100u)',
      marca: 'Generic',
      tipo: 'OTR',
      cantidadTotal: 600,
      costoUnidad: 6.00,
      descripcion: 'Paquete de 100 LEDs de varios colores para indicadores y proyectos de iluminación.',
      rfcProveedor: '1111111111DD',
      estatus: '1'
    },
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.rfcProveedor = params['rfcProveedor'] || null;
      this.nombreEmpresa = params['nombreEmpresa'] || null;
      this.filtrarProductosPorProveedor();

      if (this.rfcProveedor) {
        this.newProduct.rfcProveedor = this.rfcProveedor;
      }
    });
  }

  filtrarProductosPorProveedor() {
    if (this.rfcProveedor) {
      this.productosMostrados = this.todosLosProductos.filter(
        producto => producto.rfcProveedor === this.rfcProveedor &&
                    producto.estatus === (this.mostrarActivos ? '1' : '0')
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
      this.todosLosProductos[index].estatus = '0';
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
      this.todosLosProductos[index].estatus = '1';
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
