import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Cliente, Compra } from './/InterfazCliente';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private clientesMock: Cliente[] = [
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez García',
      genero: 'Masculino',
      telefono: '+52 477 123 4567',
      correo: 'juan.perez@email.com',
      fechaNacimiento: new Date('1990-05-15'),
      direccion: {
        calle: 'Av. López Mateos #1234',
        ciudad: 'León',
        estado: 'Guanajuato',
        domicilio: '#23',
        pais: 'México'
      },
      usuario: {
        nombreUsuario: 'juanperez90',
        estatus: 1,
        fechaRegistro: new Date('2023-01-15')
      }
    },
    {
      id: '2',
      nombre: 'María',
      apellido: 'González López',
      genero: 'Femenino',
      telefono: '+52 477 234 5678',
      correo: 'maria.gonzalez@email.com',
      fechaNacimiento: new Date('1985-08-22'),
      direccion: {
        calle: 'Calle Hidalgo #567',
        ciudad: 'León',
        estado: 'Guanajuato',
        domicilio: '#23',
        pais: 'México'
      },
      usuario: {
        nombreUsuario: 'mariagonzalez',
        estatus: 1,
        fechaRegistro: new Date('2023-02-20')
      }
    },
    {
      id: '3',
      nombre: 'Carlos',
      apellido: 'Rodríguez Martínez',
      genero: 'Masculino',
      telefono: '+52 477 345 6789',
      correo: 'carlos.rodriguez@email.com',
      fechaNacimiento: new Date('1988-12-10'),
      direccion: {
        calle: 'Blvd. Adolfo López Mateos #890',
        ciudad: 'León',
        estado: 'Guanajuato',
        domicilio: '#23',
        pais: 'México'
      },
      usuario: {
        nombreUsuario: 'carlosrodriguez',
        estatus: 0,
        fechaRegistro: new Date('2023-03-10')
      }
    },
    {
      id: '4',
      nombre: 'Ana',
      apellido: 'Hernández Silva',
      genero: 'Femenino',
      telefono: '+52 477 456 7890',
      correo: 'ana.hernandez@email.com',
      fechaNacimiento: new Date('1992-04-18'),
      direccion: {
        calle: 'Calle Morelos #345',
        ciudad: 'León',
        estado: 'Guanajuato',
        domicilio: '#23',
        pais: 'México'
      },
      usuario: {
        nombreUsuario: 'anahernandez',
        estatus: 1,
        fechaRegistro: new Date('2023-04-05')
      }
    },
    {
      id: '5',
      nombre: 'Luis',
      apellido: 'Sánchez Ramírez',
      genero: 'Masculino',
      telefono: '+52 477 567 8901',
      correo: 'luis.sanchez@email.com',
      fechaNacimiento: new Date('1987-11-30'),
      direccion: {
        calle: 'Av. Francisco Villa #678',
        ciudad: 'León',
        estado: 'Guanajuato',
        domicilio: '#23',
        pais: 'México'
      },
      usuario: {
        nombreUsuario: 'luissanchez',
        estatus: 1,
        fechaRegistro: new Date('2023-05-12')
      }
    }
  ];

  private comprasMock: Compra[] = [
    {
      id: 'P001',
      idCliente: '1',
      total: 1250.50,
      estatus: 1,
      fechaCompra: new Date('2024-01-15'),
      detallesCompra: [
        {
          id: 'I001',
          nombreProducto: 'Arduino Uno R3',
          cantidad: 2,
          precioUnitario: 350.00,
          precioTotal: 700.00
        },
        {
          id: 'I002',
          nombreProducto: 'Sensor DHT22',
          cantidad: 1,
          precioUnitario: 180.50,
          precioTotal: 180.50
        },
        {
          id: 'I003',
          nombreProducto: 'Protoboard 830 puntos',
          cantidad: 1,
          precioUnitario: 120.00,
          precioTotal: 120.00
        },
        {
          id: 'I004',
          nombreProducto: 'Kit de cables jumper',
          cantidad: 1,
          precioUnitario: 250.00,
          precioTotal: 250.00
        }
      ]
    },
    {
      id: 'P002',
      idCliente: '1',
      total: 890.75,
      estatus: 0,
      fechaCompra: new Date('2024-02-20'),
      detallesCompra: [
        {
          id: 'I005',
          nombreProducto: 'Módulo WiFi ESP8266',
          cantidad: 0,
          precioUnitario: 320.25,
          precioTotal: 320.25
        },
        {
          id: 'I006',
          nombreProducto: 'Display LCD 16x2',
          cantidad: 1,
          precioUnitario: 285.50,
          precioTotal: 285.50
        },
        {
          id: 'I007',
          nombreProducto: 'Resistencias 220Ω (pack 10)',
          cantidad: 1,
          precioUnitario: 285.00,
          precioTotal: 285.00
        }
      ]
    },
    {
      id: 'P003',
      idCliente: '2',
      total: 2150.00,
      estatus: 1,
      fechaCompra: new Date('2024-03-01'),
      detallesCompra: [
        {
          id: 'I008',
          nombreProducto: 'Arduino Mega 2560',
          cantidad: 1,
          precioUnitario: 850.00,
          precioTotal: 850.00
        },
        {
          id: 'I009',
          nombreProducto: 'Shield Ethernet',
          cantidad: 1,
          precioUnitario: 650.00,
          precioTotal: 650.00
        },
        {
          id: 'I010',
          nombreProducto: 'Sensor ultrasónico HC-SR04',
          cantidad: 2,
          precioUnitario: 325.00,
          precioTotal: 650.00
        }
      ]
    },
    {
      id: 'P004',
      idCliente: '2',
      total: 475.25,
      estatus: 0,
      fechaCompra: new Date('2024-01-10'),
      detallesCompra: [
        {
          id: 'I011',
          nombreProducto: 'Servo motor SG90',
          cantidad: 3,
          precioUnitario: 95.75,
          precioTotal: 287.25
        },
        {
          id: 'I012',
          nombreProducto: 'Buzzer 5V',
          cantidad: 2,
          precioUnitario: 94.00,
          precioTotal: 188.00
        }
      ]
    },
    {
      id: 'P005',
      idCliente: '3',
      total: 750.00,
      estatus: 1,
      fechaCompra: new Date('2024-02-15'),
      detallesCompra: [
        {
          id: 'I013',
          nombreProducto: 'Raspberry Pi 4 Model B',
          cantidad: 1,
          precioUnitario: 750.00,
          precioTotal: 750.00
        }
      ]
    },
    {
      id: 'P006',
      idCliente: '5',
      total: 1800.50,
      estatus: 0,
      fechaCompra: new Date('2024-03-05'),
      detallesCompra: [
        {
          id: 'I014',
          nombreProducto: 'Kit de sensores Arduino (37 piezas)',
          cantidad: 1,
          precioUnitario: 1200.00,
          precioTotal: 1200.00
        },
        {
          id: 'I015',
          nombreProducto: 'Multímetro digital',
          cantidad: 1,
          precioUnitario: 600.50,
          precioTotal: 600.50
        }
      ]
    }
  ];

  constructor() {}

  obtenerClientes(): Observable<Cliente[]> {
    return of(this.clientesMock).pipe(delay(800));
  }

  obtenerCliente(id: string): Observable<Cliente> {
    const cliente = this.clientesMock.find(c => c.id === id);
    if (!cliente) throw new Error(`Cliente con ID ${id} no encontrado`);
    return of(cliente).pipe(delay(600));
  }

  obtenerComprasCliente(idCliente: string): Observable<Compra[]> {
    const comprasCliente = this.comprasMock.filter(c => c.idCliente === idCliente);
    return of(comprasCliente).pipe(delay(700));
  }

  actualizarEstadoCliente(idCliente: string, estado: number): Observable<any> {
    const cliente = this.clientesMock.find(c => c.id === idCliente);
    if (cliente) {
      cliente.usuario.estatus = estado as 1| 0;
    }
    return of({ exito: true }).pipe(delay(500));
  }
}
