import { ClienteService } from '../../Cliente/cliente.service';
import { Component, inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment, session } from '../../../enviroments/enviroment';
import { GestorSesion } from '../../ServiciosGlobales/GestorSesion';
import { Cliente } from '../../Models/ClienteModel';
import { Ciudad } from '../../Models/CiudadModel';
import { CiudadService } from '../../ServiciosGlobales/CiudadService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';
  loginData = { email: '', password: '' };
  loginError: string | null = null;
  loginSuccess: string | null = null;
  registerError: string | null = null;
  registerSuccess: string | null = null;

  ciudades: Ciudad[] = [];
  confirmarContrasenia: string = '';
  servicioCliente: ClienteService = inject(ClienteService)

  clienteRegisterData: Cliente = {
    idCliente: 0,
    idPersona: 0,
    persona: {
      idPersona: 0,
      apPaterno: '',
      apMaterno: '',
      nombre: '',
      fechaNacimiento: '',
      email: '',
      telefono: '',
      genero: '',
      idDomicilio: 0,
      domicilio: {
        idDomicilio: 0,
        calle: '',
        numero: '',
        colonia: '',
        codigoPostal: '',
        idCiudad: 0,
        ciudad: null
      }
    },
    idUsuario: 0,
    usuario: {
      idUsuario: 0,
      nombreUsuario: '',
      token: '',
      estatus: true,
      contrasenia: '',
      rol: 'CLIE'
    }
  };

  constructor(private router: Router, private http: HttpClient,
    private ciudadService: CiudadService = inject(CiudadService),

  ) { }

  ngOnInit(): void {
    this.cargarCiudades();
  }


  cargarCiudades(): void {
    this.ciudadService.getCiudades().then(ciudades => this.ciudades = ciudades);
  }



  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages() {
    this.loginError = this.loginSuccess = this.registerError = this.registerSuccess = null;
  }

  handleLogin(form: NgForm) {
    Swal.fire({                     // Mostrar loading mientras se procesa
      title: 'Iniciando sesión...',
      text: 'Por favor espere',
      allowOutsideClick: true,
      allowEscapeKey: true,
      showConfirmButton: true,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (form.valid) {
      this.http.post<{ token: string }>(environment.backUrl + 'inicioSesion', {
        nombreUsuario: this.loginData.email,
        contrasenia: this.loginData.password
      }).subscribe(
        (data) => {
          GestorSesion.setToken(data.token);
          var usuario = GestorSesion.getDatosToken();
          if (usuario) {
            switch ((usuario.rol).toString()) {
              case 'ADMS':
                this.router.navigate(['/dashboard']);
                break;
              case 'CLIE':
                this.router.navigate(['/']);
                break;
              case 'EMPL':
                this.router.navigate(['/dashboard'])
                break;
              default:
                console.log("Error al obtener el rol del usuario");
                console.warn("Error al obtener el rol del usuario");
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "No se obtuvo el tipo de usuario que ingresa. Intente de nuevo"
                });
            }
          }
        },
        (error) => {
          console.log("Error: ", error.statusText);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "" + error.statusText
          });
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Complete los campos!"
      });
    }
  }



  validarAtributosCliente() { // Valida teléfono pa q no truene para que tenga menos de 10 dígitos
    const telefono = this.clienteRegisterData.persona.telefono;
    const numero = this.clienteRegisterData.persona.domicilio.numero;

    const telefonoValido = /^\d{10}$/.test(telefono);
    const numeroValido = /^\d+$/.test(numero.toString());

    if (!telefonoValido) {
      this.registerError = "El teléfono debe tener exactamente 10 dígitos numéricos.";
      return false;
    }

    if (!numeroValido) {
      this.registerError = "El número de domicilio debe ser un valor numérico válido.";
      return false;
    }
    // Validar que la ciudad esté seleccionada
    if (!this.clienteRegisterData.persona.domicilio.idCiudad || parseInt(this.clienteRegisterData.persona.domicilio.idCiudad.toString()) <= 0) {
      return false;
    }
    // validar que el genero sea solo M, F, O
    const genero = this.clienteRegisterData.persona.genero;
    if (!['M', 'F', 'O'].includes(genero)) {
      return false;
    }

    // Validar que la fecha de nacimiento no sea futura
    const fechaNacimiento = new Date(this.clienteRegisterData.persona.fechaNacimiento);
    const hoy = new Date();
    if (fechaNacimiento > hoy) {
      console.log("La fecha de nacimiento no puede ser futur\nFecha Nac: ", fechaNacimiento, " Hoy: ", hoy);
      this.registerError = "La fecha de nacimiento no puede ser futura.";
      return false;
    }
    return true;
  }

  handleRegister(form: NgForm) {

    if (!this.validarAtributosCliente()) {
      Swal.fire('Error', this.registerError || 'Error en los datos ingresados\nTeléfono debe tener 10 dígitos.', 'error');
      return;
    }

    if (form.valid) {
      if (this.clienteRegisterData.usuario.contrasenia !== this.confirmarContrasenia) {
        Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
        return;
      }

      const clienteRegistro: Cliente = {
        idCliente: 0,
        idPersona: 0,
        persona: {
          idPersona: 0,
          apPaterno: this.clienteRegisterData.persona.apPaterno,
          apMaterno: this.clienteRegisterData.persona.apMaterno,
          nombre: this.clienteRegisterData.persona.nombre,
          fechaNacimiento: this.clienteRegisterData.persona.fechaNacimiento,
          email: this.clienteRegisterData.persona.email,
          telefono: this.clienteRegisterData.persona.telefono,
          genero: this.clienteRegisterData.persona.genero,
          idDomicilio: 0,
          domicilio: {
            idDomicilio: 0,
            calle: this.clienteRegisterData.persona.domicilio.calle,
            numero: this.clienteRegisterData.persona.domicilio.numero,
            colonia: this.clienteRegisterData.persona.domicilio.colonia,
            codigoPostal: this.clienteRegisterData.persona.domicilio.codigoPostal,
            idCiudad: this.clienteRegisterData.persona.domicilio.idCiudad,
            ciudad: null
          }
        },
        idUsuario: 0,
        usuario: {
          idUsuario: 0,
          nombreUsuario: this.clienteRegisterData.usuario.nombreUsuario,
          token: '',
          estatus: true,
          contrasenia: this.clienteRegisterData.usuario.contrasenia,
          rol: 'CLIE'
        }
      };
      console.log(clienteRegistro);
      this.servicioCliente.registrarCliente(clienteRegistro).subscribe({
        next: (res) => {
          this.registerSuccess = "Cuenta creada exitosamente.\n" + res;
          form.reset();

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: res.message || 'Inicie sesión ahora.',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'Aceptar'
          });
          this.switchTab('login');
        },
        error: (err) => {
          console.error(err);
          this.registerError = "Hubo un error al registrar el cliente.";
          Swal.fire('Error', 'Hubo un error al registrar el cliente.' + err, 'error');
        }
      });
    } else {
      this.registerError = "Por favor, completa todos los campos requeridos correctamente.";
      Swal.fire('Error', 'Por favor, completa todos los campos requeridos correctamente.', 'error');
    }
  }

  socialLogin(provider: string) {
    alert(`Funcionalidad de ${provider} en desarrollo. Pronto estará disponible.`);
  }

  showForgotPassword(event: Event) {
    event.preventDefault();
    const email = prompt('Ingresa tu email para recuperar tu contraseña:');
    if (email) {
      alert(`Se ha enviado un enlace de recuperación a ${email}`);
    }
  }
}
