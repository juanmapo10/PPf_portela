import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {

  email: string = '';
  password: string = '';
  errorMessage: string = ''; 

  constructor(private afAuth: Auth, private router: Router) { }

  async login() {
    try {
      const user = await signInWithEmailAndPassword(this.afAuth ,this.email, this.password);
      if (user) {
        this.router.navigateByUrl('/home'); 
        this.limpiar_visor();
      }
    } catch (error:any) {
      this.errorMessage = this.getErrorMessage(error.code); // Mostrar mensaje de error
    }
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  limpiar_visor()
  {
    this.email = "";
    this.password = "";
  }

  iniciar_admin()
  {
  this.email = "admin@admin.com"
  this.password = "111111"

  }
  iniciar_profe()
  {
  this.email = "invitado@invitado.com"
  this.password = "222222"

  }
  iniciar_usu()
  {
  this.email = "usuario@usuario.com"
  this.password = "333333"

  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/user-disabled':
        return 'El usuario ha sido deshabilitado.';
      case 'auth/user-not-found':
        return 'Usuario no encontrado.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      default:
        return 'Ha ocurrido un error desconocido. Inténtalo de nuevo.';
    }
  }
}