import { Component } from '@angular/core';
import { Footer } from "../../footer/footer";
import { BarraNavegacion } from "../../Administrador/barra-navegacion/barra-navegacion";

@Component({
  selector: 'app-ventas-cliente.component',
  imports: [Footer, BarraNavegacion],
  templateUrl: './ventas-cliente.component.html',
  styleUrl: './ventas-cliente.component.css'
})
export class VentasClienteComponent {

}
