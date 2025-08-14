import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Footer } from "../../footer/footer";
import { BarraNavegacion } from "../../Administrador/barra-navegacion/barra-navegacion";
import { ClienteService } from '../cliente.service';
import { VentaConDetallesDto } from '../../DTO/VentaConDetalleDto';
import Swal from 'sweetalert2';
import { VentaService } from '../venta.component/venta.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ventas-cliente.component',
  imports: [Footer, BarraNavegacion],
  templateUrl: './ventas-cliente.component.html',
  styleUrl: './ventas-cliente.component.css'
})
export class VentasClienteComponent implements OnInit {

  ventasCliente: VentaConDetallesDto[] = [];
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ventaService: VentaService = inject(VentaService),
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  cargaVentas() : void{
    this.ventaService.obtenerCompradosPorUsuario().subscribe({
      next: (resultado) => {
        console.log(resultado);
        this.ventasCliente = resultado ?? [];
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudieron cargar tus compras: ' + error, 'error');
        console.error("Error cargando compras de cliente:", error);
      }
    });
  }



  ngOnInit(): void {
    this.cargaVentas();
  }

}
