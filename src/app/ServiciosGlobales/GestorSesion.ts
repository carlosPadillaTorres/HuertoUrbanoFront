import { jwtDecode } from "jwt-decode";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment, session } from '../../enviroments/enviroment';
import { Router } from "@angular/router";
import { error } from "console";


export class GestorSesion {

  static setToken(token: string) {
    localStorage.setItem('token', token);
    session.token = token;
  }

  static getDatosToken(): any {
    const token = localStorage.getItem('token');
    //const token = session.token;
    return token ? jwtDecode(token) : null;
  }

  static getToken() {
    // 1. Verificamos si estamos en el navegador
    if (typeof window !== 'undefined') {
      // 2. Si estamos en el navegador, accedemos a localStorage
      const tokenResponse = localStorage.getItem('token');

      if (!tokenResponse) {
        console.error('No se encontró un token en el localStorage.');
        // Es mejor devolver null y manejarlo en el componente
        return null;
      }
      return tokenResponse;
    }

    // 3. Si no estamos en el navegador (servidor), retornamos null
    return null;
  }
  static eliminarToken() {
    console.log("eliminarToken LocalStorage: ", localStorage.getItem('token'));
    localStorage.setItem('token', '');
    localStorage.removeItem('token');
    session.token = 'null';
  }


  static confirmarCerrarSesion(http: HttpClient, router: Router) {
    Swal.fire({
      title: "¿Quieres cerrar sesión?",
      showCancelButton: true,
      confirmButtonText: "Si, cerrar sesión",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.cerrarSesion(http, router);
      }
    });
  }

  static cerrarSesion(http: HttpClient, router: Router) {
    const encabezados = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      responseType: 'text'
    });

    http.get(environment.backUrl + 'cerrarSesion', {
      headers: encabezados
    }).subscribe(
      (data: any) => {
        Swal.fire({
          icon: "success",
          title: "Hecho!",
          text: "" + (data && data.mensaje ? data.mensaje : "Sesión cerrada correctamente")
        });

        this.eliminarToken();
        router.navigate(['/login']);

      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal al intentar cerrar sesión. Intente de nuevo.\n" + error.statusText
        });
      }
    );
  }

}
