import { Routes } from '@angular/router';
import { LoginComponent } from './Administrador/login/login.component';
import { DashboardComponent } from './Administrador/Dashboard/dashboard';
import { HomeComponent } from './home/home.component';
import { Proveedores} from './Administrador/Proveedores/proveedores';
import { EmpleadosComponent } from './Administrador/Empleados/empleados';
import { ProductosComponent } from './Administrador/Productos/productos';
import { ListaClientesComponente } from './Administrador/Clientes/ListaClientes/ListaClientes.component';
import { DetalleClienteComponente } from './Administrador/Clientes/DetalleCliente/DetalleCliente.component';

export const routes: Routes = [
  // principal
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent },

  { path: 'proveedores', component: Proveedores },

  { path: 'empleados', component: EmpleadosComponent },

  { path: 'productos', component: ProductosComponent },

  { path: 'admin/clientes', component: ListaClientesComponente },

  { path: 'admin/detalleCliente/:id', component: DetalleClienteComponente }

];
