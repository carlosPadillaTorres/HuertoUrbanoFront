import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '', confirm: '' };
  loginError: string | null = null;
  loginSuccess: string | null = null;
  registerError: string | null = null;
  registerSuccess: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages() {
    this.loginError = this.loginSuccess = this.registerError = this.registerSuccess = null;
  }

  handleLogin(form: NgForm) {
    if (form.valid) {

      this.http.post('http://localhost:5269/inicioSesion', {
        nombreUsuario: this.loginData.email,
        contrasenia: this.loginData.password
      }).subscribe(
        (data) => {
            this.router.navigate(['/dashboard'])
       },
       (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Credenciales incorrectas. Verifica tu usuario y contraseña."
        });
       }
     );
    }
  }

  cerrarSesion(){
    this.http.get('https://localhost:7276/cerrarSesion').subscribe(
        (data) => {
          Swal.fire({
          icon: "success",
          title: "Hecho!",
          text: ""+data
        });
       },
       (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Algo salió mal al intentar cerrar sesión. Intente de nuevo."
        });
       }
     );
  }

  handleRegister(form: NgForm) {
    if (form.valid) {
      if (this.registerData.password !== this.registerData.confirm) {
        this.registerError = 'Las contraseñas no coinciden.';
        return;
      }
      const users = JSON.parse(localStorage.getItem('techguardian_users') || '[]');
      if (users.find((u: any) => u.email === this.registerData.email)) {
        this.registerError = 'Este email ya está registrado.';
        return;
      }
      const newUser = {
        id: Date.now(),
        name: this.registerData.name,
        email: this.registerData.email,
        password: this.registerData.password,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('techguardian_users', JSON.stringify(users));
      this.registerSuccess = '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.';
      this.registerError = null;
      setTimeout(() => {
        this.switchTab('login');
        form.reset();
      }, 2000);
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
