import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private afAuth: Auth, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  async register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
      return;
    }

    const { email, password } = this.registerForm.value;

    try {
      const signInMethods = await fetchSignInMethodsForEmail(this.afAuth, email);
      if (signInMethods.length > 0) {
        this.errorMessage = 'El correo electrónico ya está en uso.';
        return;
      }

      await createUserWithEmailAndPassword(this.afAuth, email, password);
      this.registerForm.reset();
      this.successMessage = 'Usuario registrado exitosamente.';
      this.router.navigateByUrl('/login');
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está en uso.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil.';
      case 'auth/missing-password':
        return 'La contraseña es requerida.';
      default:
        return 'Ha ocurrido un error desconocido. Inténtalo de nuevo.';
    }
  }
}